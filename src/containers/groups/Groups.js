import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MultiSelect from "react-multi-select-component";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Modal from 'react-modal';

import logo from '../../assets/logo.svg';
import './Groups.css';
import SingleDropdown from "../../components/SingleDropdown";
import { fetchGroups, fetchProfessionTypes, fetchProfessionals, fetchProfessional, createGroup } from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";
import { CreateGroupForm } from "../../components/CreateGroupForm";
import {Button} from "../../components/Button";
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";


const customStyles = {
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

Modal.setAppElement('#root');

const filterProfessionals = (professionals, searchTerm) => {
  let filteredProfessionals = professionals;
  if (searchTerm && searchTerm.trim() !== "") {
    let searchLower = searchTerm.toLowerCase();
    filteredProfessionals = filteredProfessionals.filter(professional =>
      (professional.firstName && professional.firstName.toLowerCase().indexOf(searchLower) >= 0) ||
      (professional.lastName && professional.lastName.toLowerCase().indexOf(searchLower) >= 0) ||
      (professional.description && professional.description.toLowerCase().indexOf(searchLower) >= 0)
      // (professional.notes && professional.notes.toLowerCase().indexOf(searchLower) >= 0)
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
      formattedGroups.push({value: uid, label: group.name})
    });
  }
  return formattedGroups;
};


const Groups = () => {
  // Redux state initialisation
  const groups = useSelector(state => state.professionals.groups);
  const dispatch = useDispatch();

  // State initialisation
  const groupsOptions = formatGroups(groups);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [createFormName, setCreateFormName] = useState("");
  const [createFormDescription, setCreateFromDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (Object.entries(groups).length === 0) {
      dispatch(fetchGroups());
    }
  }, [selectedGroup]);

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

  if (Object.entries(groups).length > 0) {
    let filteredProfessionals = [];
    if (selectedGroup) {
      filteredProfessionals = filterProfessionals(groups[selectedGroup.value]["professionals"], searchTerm);
    }
    return (
      <div className="homepage">
        <div className="professional-body">
          <div className="search-container">
            <div className="group-dropdown-container">
              <SingleDropdown
                options={groupsOptions}
                selectedValue={selectedGroup}
                onChange={setSelectedGroup}
                placeholder="Select Group..."
                valuePrefix=""
              />
            </div>
            <span onChange={(e) => setSearchTerm(e.target.value)}>
              <input
                id="search-input"
                className="search-input"
                placeholder="Search by name, specialty, or clinic..."
              />
            </span>
            <span className="create-group-border-container">
              <Button
                text="Create Group"
                onPress={() => setCreateGroupModalOpen(true)}
                icon={<i className="fa fa-plus plus-icon" aria-hidden="true"/>}
              />
              <Modal
                isOpen={createGroupModalOpen}
                onRequestClose={() => setCreateGroupModalOpen(!createGroupModalOpen)}
                style={customStyles}
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
            </span>
          </div>
          <div className="professional-results">
            {filteredProfessionals.length
              ? <div className="professionals-results-body">
                <ul className="professional-list">
                  {filteredProfessionals.map((professional) => {
                    return (
                      <ProfessionalListItem
                        currentProfessional={currentProfessional}
                        professional={professional}
                        professionals={filteredProfessionals}
                        setCurrentProfessional={setCurrentProfessional}
                        />
                    )
                  })}
                </ul>
                <div className="current-professional-box">
                  {currentProfessional && filteredProfessionals.indexOf(currentProfessional) >= 0
                    ? <CurrentProfessionalContent currentProfessional={currentProfessional}/>
                    : <div className="no-selection">No Professional Selected</div>
                  }
                </div>
              </div>
              : <div className="professionals-results-body"/>
            }
          </div>
        </div>
      </div>
    );
  } else {
    return null
  }
};

export default Groups;
