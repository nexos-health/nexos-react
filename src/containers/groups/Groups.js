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
import Modal from "react-modal";
import {CreateGroupForm} from "../../components/CreateGroupForm";
import {CreateFirstGroup} from "../../components/CreateFirstGroup";
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {RemoveFromGroupConfirmation} from "../../components/RemoveFromGroupConfirmation";
import {useAuth0} from "../../react-auth0-spa";
import {GroupsTable} from "../../components/GroupsTable";
import {
  BaseButton,
  FlexColumn,
  FlexRow,
  IconButton,
  BoldedText,
  ParagraphText, SearchBarContainer, SearchInput
} from "../../components/BaseStyledComponents";


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

const filteredGroups = (groups, searchTerm) => {
  let filteredGroups = groups;
  if (searchTerm && searchTerm.trim() !== "") {
    let searchLower = searchTerm.toLowerCase();
    filteredGroups = filteredGroups.filter(group => {
        let name = group.label && group.label.toLowerCase();
        let description = group.description && group.description.toLowerCase();

        return (
          (name && name.indexOf(searchLower) >= 0) ||
          (description && description.indexOf(searchLower) >= 0)
        )
      }
    );
  }

  filteredGroups.sort((a, b) => {
    const aName = a.name;
    const bName = b.mame;
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  });

  return filteredGroups;
};


const Groups = () => {
  const groups = useSelector(state => state.professionals.groups);
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
  } = useAuth0();

  // State initialisation
  const groupsOptions = formatGroups(groups);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [addToGroupModalOpen, setAddToGroupModalOpen] = useState(false);
  const [removeFromGroupModalOpen, setRemoveFromGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [createFormName, setCreateFormName] = useState("");
  const [createFormDescription, setCreateFromDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessionals, setSelectedProfessionals] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");


  const handleCreateGroupModalClose = () => {
    setCreateGroupModalOpen(false);
    setCreateFromDescription("");
    setCreateFormName("");
  };

  const handleCreateGroupSubmit = () => {
    dispatch(createGroup(createFormName, createFormDescription));
    setCreateGroupModalOpen(false);
    setCreateFromDescription("");
    setCreateFormName("");
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

  useEffect(() => {
    if (Object.entries(groups).length === 0) {
      dispatch(fetchGroups());
    }
  }, [selectedGroup]);


    return (
      <GroupPageBody>
        <div className="professional-results">
          <GroupsContainer>
            {groupsOptions.length > 0
              ? <div>
                <GroupsHeader>
                  <FlexColumn>
                    <GroupsTitle>Groups</GroupsTitle>
                    {groupsOptions.length > 0 && <GroupsDescription>
                      Create groups to organise professionals into helpful categories
                      such as “Diabetes Support” or “Favourites”,
                      so you can quickly find them at a later stage
                    </GroupsDescription>}
                  </FlexColumn>
                  <GroupsActions>
                    {groupsOptions.length > 0 &&
                    <BaseButton onClick={() => setCreateGroupModalOpen(true)}>Create Group</BaseButton>
                    }
                  </GroupsActions>
                </GroupsHeader>
                <SearchBarContainer>
                  <SearchBar onChange={(e) => setSearchTerm(e.target.value)}>
                    <SearchInput
                      placeholder="Search by group name or description..."
                    />
                  </SearchBar>
                </SearchBarContainer>
                <GroupsTable
                  groupsOptions={filteredGroups(groupsOptions, searchTerm)}
                  groups={groups}
                />
              </div>
              : <CreateFirstGroup
                createGroup={() => setCreateGroupModalOpen(true)}
                loginWithRedirect={loginWithRedirect}
                isAuthenticated={isAuthenticated}
              />
            }
          </GroupsContainer>
        </div>
        {/*BELOW WE KEEP THE CODE FOR THE MODALS*/}
        <Modal
          isOpen={createGroupModalOpen}
          onRequestClose={() => setCreateGroupModalOpen(!createGroupModalOpen)}
          style={createGroupCustomStyles}
          contentLabel="Example Modal"
        >
          <CreateGroupForm
            groupName={createFormName}
            groupDescription={createFormDescription}
            setGroupName={setCreateFormName}
            setGroupDescription={setCreateFromDescription}
            handleSubmit={handleCreateGroupSubmit}
            handleClose={handleCreateGroupModalClose}
          />
        </Modal>
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
      </GroupPageBody>
    );
};

export default Groups;


const GroupPageBody = styled(FlexColumn)`
  padding-top: 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  border-bottom-style: solid;
  border-bottom-width: 1px;
`;

const GroupSummaryHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const GroupSummaryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 20px;
`;

const GroupSummaryDescription = styled.div`
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 500;
  font-style: normal;
  font-size: 14px;
  max-width: 550px;
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
  padding-left: 30px;
`;