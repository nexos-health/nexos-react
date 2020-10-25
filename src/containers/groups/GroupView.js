import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components/macro';
import Select, { components } from 'react-select'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import './Groups.css';
import {
  fetchProfessionTypes,
  fetchProfessionals,
  fetchProfessional,
  addProfessionalsToGroup,
  removeProfessionalsFromGroup,
  createGroup,
  fetchGroups,
  deleteGroup,
  editGroup,
} from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";
import Modal from "react-modal";
import {CreateGroupForm} from "../../components/CreateGroupForm";
import {CreateFirstGroup} from "../../components/CreateFirstGroup";
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {RemoveFromGroupConfirmation} from "../../components/RemoveFromGroupConfirmation";
import {DeleteGroupConfirmation} from "../../components/DeleteGroupConfirmation";
import {GroupActionsOptions} from "../../components/GroupActionsOptions";
import {useAuth0} from "../../react-auth0-spa";
import {AuthenticatePrompt} from "../../components/AuthenticatePrompt";
import {
  EditableGroupSummary,
  EditActions,
  GroupTitle,
  SaveButton
} from "../../components/EditableGroupSummary";
import {GroupsTable} from "../../components/GroupsTable";
import {
  BaseButton,
  FlexColumn,
  FlexRow,
  IconButton,
  BoldedText,
  ParagraphText, SearchBarContainer, SearchInput
} from "../../components/BaseStyledComponents";
import SearchResults from "../home/SearchResults";
import { SearchContainer }from "../home/Home";
import {Link} from "react-router-dom";


Modal.setAppElement('#root');


const createGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '305px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};

const addToGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '315px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};

const removeFromGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '135px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};

const deleteGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '250px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};


const filterProfessionals = (professionals, searchTerm) => {
  let filteredProfessionals = professionals;
  if (searchTerm && searchTerm.trim() !== "") {
    let searchLower = searchTerm.toLowerCase();
    filteredProfessionals = filteredProfessionals.filter(professional => {
        let firstName = professional.firstName && professional.firstName.toLowerCase();
        let lastName = professional.lastName && professional.lastName.toLowerCase();

        return (
          (firstName && firstName.indexOf(searchLower) >= 0) ||
          (lastName && lastName.indexOf(searchLower) >= 0) ||
          (firstName && lastName && `${firstName} ${lastName}`.indexOf(searchLower) >= 0) ||
          (professional.description && professional.description.toLowerCase().indexOf(searchLower) >= 0)
          // (professional.notes && professional.notes.toLowerCase().indexOf(searchLower) >= 0)
        )
      }
    );
  }

  filteredProfessionals.sort((a, b) => {
    const aName = a.lastName;
    const bName = b.lastName;
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  });

  return filteredProfessionals;
};

const formatGroups = (groups) => {
  let formattedGroups = [];
  if (Object.keys(groups).length > 0) {
    Object.entries(groups).forEach(([uid, group]) => {
      formattedGroups.push({value: uid, label: group.name, description: group.description})
    });
  }

  return formattedGroups.sort((a, b) => {
    const aName = a.label.toLowerCase();
    const bName = b.label.toLowerCase();
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  });
};


const GroupView = ({ match }) => {
  const groups = useSelector(state => state.professionals.groups);
  // const currentProfessional = useSelector(state => state.professionals.currentProfessional);
  const dispatch = useDispatch();

  // State initialisation
  const groupsOptions = formatGroups(groups);
  const selectedGroup = (groupsOptions && groupsOptions.filter((group) => group.value === match.params.id)[0]) || {};
  let filteredProfessionals = [];

  const [addToGroupModalOpen, setAddToGroupModalOpen] = useState(false);
  const [removeFromGroupModalOpen, setRemoveFromGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [selectedProfessionals, setSelectedProfessionals] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectedProfessional = (uid) => {
    if (selectedProfessionals.has(uid)) {
      setSelectedProfessionals(selectedProfessionals => new Set([...selectedProfessionals].filter(x => x !== uid)));
    } else {
      setSelectedProfessionals(selectedProfessionals => new Set([...selectedProfessionals, ...new Set([uid])]))
    }

  };

  const handleGroupOptions = () => {
    prompt("Edit Group")
  };

  const handleAddProfessionalsToGroupSubmit = (group) => {
    dispatch(addProfessionalsToGroup(selectedProfessionals, group.value));
    setAddToGroupModalOpen(false);
    setSelectedProfessionals(new Set());
  };

  const handleRemoveFromGroupSubmit = (group) => {
    dispatch(removeProfessionalsFromGroup(selectedProfessionals, group.value));
    setRemoveFromGroupModalOpen(false);
    setSelectedProfessionals(new Set());
  };

  const handleDeleteGroupConfirm = (group) => {
    dispatch(deleteGroup(group.value));
    setDeleteGroupModalOpen(false)
  };

  const handleEditGroupSave = () => {
    dispatch(editGroup(selectedGroup.value, editGroupName, editGroupDescription));
    setEditGroupName("");
    setEditGroupDescription("");
    setEditGroupModalOpen(false);
  };

  const handleEditGroupCancel = () => {
    setEditGroupName("");
    setEditGroupDescription("");
    setEditGroupModalOpen(null)
  };

  useEffect(() => {
    if (Object.entries(groups).length === 0) {
      dispatch(fetchGroups());
    }
  }, [selectedGroup]);


  if (Object.keys(groups).indexOf(selectedGroup.value) >= 0) {
      let professionalsList = selectedGroup && groups[selectedGroup.value] && groups[selectedGroup.value]["professionals"];
      filteredProfessionals = filterProfessionals(professionalsList, searchTerm);

    return (
      <GroupPageBody>
        <div className="professional-body">
          <GroupSummaryBody>
            <GroupSummary>
              <BackButtonContainer>
                <BackIcon className="fa fa-chevron-left"/>
                <IconButton>
                  <Link to="/groups">Back to Groups</Link>
                </IconButton>
              </BackButtonContainer>
              <GroupSummaryHeader>
                <GroupSummaryTitle>{selectedGroup.label}</GroupSummaryTitle>
                <i className="fa fa-edit group-edit" onClick={() => setEditGroupModalOpen(true)}/>
              </GroupSummaryHeader>
              <GroupSummaryDescription>{selectedGroup.description}</GroupSummaryDescription>
            </GroupSummary>
            <SearchBarContainer>
              <SearchBar onChange={(e) => setSearchTerm(e.target.value)}>
                <SearchInput placeholder="Search by group name or description..."/>
              </SearchBar>
            </SearchBarContainer>
          </GroupSummaryBody>
          <SearchResults
            groupsOptions={groupsOptions}
            filteredProfessionals={filteredProfessionals}
            selectedProfessionals={selectedProfessionals}
            setSelectedProfessionals={setSelectedProfessionals}
            handleSelectedProfessional={handleSelectedProfessional}
          />
        </div>
        {/*BELOW WE KEEP THE CODE FOR THE MODALS*/}
        <Modal
          isOpen={removeFromGroupModalOpen}
          onRequestClose={() => setRemoveFromGroupModalOpen(!removeFromGroupModalOpen)}
          style={removeFromGroupCustomStyles}
          contentLabel="Example Modal"
        >
          <RemoveFromGroupConfirmation
            group={selectedGroup}
            selectedProfessionals={selectedProfessionals}
            handleSubmit={handleRemoveFromGroupSubmit}
            handleClose={() => setRemoveFromGroupModalOpen(!removeFromGroupModalOpen)}
          />
        </Modal>
        <Modal
          isOpen={addToGroupModalOpen}
          onRequestClose={() => setAddToGroupModalOpen(!addToGroupModalOpen)}
          style={addToGroupCustomStyles}
          contentLabel="Example Modal"
        >
          <MoveToGroupSelector
            groups={groupsOptions}
            handleSubmit={handleAddProfessionalsToGroupSubmit}
            handleClose={() => setAddToGroupModalOpen(!addToGroupModalOpen)}
          />
        </Modal>
        <Modal
          isOpen={deleteGroupModalOpen}
          onRequestClose={() => setDeleteGroupModalOpen(!deleteGroupModalOpen)}
          style={deleteGroupCustomStyles}
          contentLabel="Example Modal"
        >
          {/*<DeleteGroupConfirmation*/}
          {/*group={group}*/}
          {/*handleSubmit={() => handleDeleteGroupConfirm(group)}*/}
          {/*handleClose={() => setDeleteGroupModalOpen(!deleteGroupModalOpen)}*/}
          {/*/>*/}
        </Modal>
        <Modal
          isOpen={editGroupModalOpen}
          onRequestClose={() => setEditGroupModalOpen(!editGroupModalOpen)}
          style={createGroupCustomStyles}
          contentLabel="Example Modal"
        >
          <CreateGroupForm
            groupName={editGroupName}
            groupDescription={editGroupDescription}
            setGroupName={setEditGroupName}
            setGroupDescription={setEditGroupDescription}
            handleSubmit={handleEditGroupSave}
            handleClose={handleEditGroupCancel}
          />
        </Modal>
      </GroupPageBody>
    );
  } else {
    return null
  }
};

export default GroupView;


const GroupPageBody = styled(FlexColumn)`
  width: 100%;
  height: 100%;
`;

const GroupSummaryBody = styled(FlexColumn)`
  width: 100%;
  justify-content: center;
  flex-grow: 1;
  max-width: 1100px;
`;

const ProfessionalResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 650px;
`;

const ProfessionalResultsListContainer = styled.div`
  border-color: darkslategrey;
  border-right: inset;
`;

const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 650px;
  padding: 0 150px;
`;

const GroupsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 30px 50px 30px;
`;

const GroupsActions = styled.div`
  align-self: flex-start;
  white-space: nowrap;
`;

const GroupsTitle = styled(BoldedText)`
  font-weight: 600;
  font-size: 24px;
`;

const GroupsDescription= styled(BoldedText)`
  max-width: 550px;
  font-weight: 500;
`;

const GroupSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;
  min-height: 100px;
`;

const GroupSummaryHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 700px;
`;

const GroupSummaryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 20px;
`;

const GroupSummaryEditTitle = styled.input`
  display: flex;
  justify-content: space-between;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 20px;
  border-radius: 3px;
  border-color: darkslategrey;
  border-width: 1px;
`;

const GroupSummaryDescription = styled.div`
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 500;
  font-style: normal;
  font-size: 14px;
  max-width: 700px;
`;

const GroupEditDescription = styled.textarea`
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 500;
  font-style: normal;
  font-size: 14px;
  max-width: 700px;
  border-radius: 3px;
  border-color: darkslategrey;
`;

const ProfessionalListActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 8px 0 8px 40px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-bottom-style: solid;
`;

const TitleText = styled.div`
  padding: 0 0 0 20px;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 14px;
`;

const CurrentProfessionalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: black;
  padding: 20px;
  width: 550px;
`;

export const NoCurrentProfessionalContainer = styled(FlexColumn)`
  justify-content: flex-start;
  color: black;
  border-color: darkslategrey;
  padding: 20px;
`;

const BackButtonContainer = styled(FlexRow)`
  align-self: flex-start;
`;

const BackIcon = styled.i`
  align-self: center;
  padding-right: 3px;
  font-size: small;
`;

const DistanceContainer = styled.div`
  width: 140px;
  font-size: 0.9em;
  color: hsl(0,0%,50%);
`;

const SidebarSectionText = styled(ParagraphText)`
  font-weight: 900;
  font-style: normal;
  font-size: 14px;
  padding: 5px 0 5px 0;
  &:hover {
    cursor: pointer;
    background-color: #f1f1f1;
  }
  ${props => props.selected && css`
    color: #3b6ad3;
  `}
`;

const SearchBar = styled.span`
  padding-top: 30px;
`;