import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MultiSelect from "react-multi-select-component";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import logo from '../../assets/logo.svg';
import './HomePage.css';
import SingleDropdown from "../../components/SingleDropdown";
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
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {RemoveFromGroupConfirmation} from "../../components/RemoveFromGroupConfirmation";
import {DeleteGroupConfirmation} from "../../components/DeleteGroupConfirmation";
import {GroupActionsOptions} from "../../components/GroupActionsOptions";
import {useAuth0} from "../../react-auth0-spa";
import {AuthenticatePrompt} from "../../components/AuthenticatePrompt";


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

const groupActionsCustomStyles = {
  content : {
    // top                   : '40%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    height                : '100px',
    width                 : '150px',
    transform             : 'translate(-50%, -50%)'
  }
};

const authenticateCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '190px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};


const formatProfessionTypes = (professionTypes) => {
  let formattedProfessionTypes = professionTypes.map((professionType) => {
    return ({
        "value": professionType.uid,
        "label": professionType.name,
      })
  });
  return formattedProfessionTypes
};

const filterProfessionals = (professionals, searchTerm, latLngBounds) => {
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

  if (Object.keys(latLngBounds).length !== 0) {
    filteredProfessionals = filteredProfessionals.filter(professional => {
      let withinBounds = false;
      for (let clinic of professional.clinics) {
        if (clinic.latitude && clinic.longitude && latLngBounds.latitude.min <= clinic.latitude &&
          clinic.latitude <= latLngBounds.latitude.max && latLngBounds.longitude.min <= clinic.longitude &&
          clinic.longitude <= latLngBounds.longitude.max) {
          withinBounds = true;
          break
        }
      }
      return withinBounds
    })
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


const HomePage = () => {
  // Redux state initialisation
  const account = useSelector(state => state.account.accountDetails);
  const professionals = useSelector(state => state.professionals.professionals);
  const professionTypes = useSelector(state => state.professionals.professionTypes);
  const groups = useSelector(state => state.professionals.groups);
  // const currentProfessional = useSelector(state => state.professionals.currentProfessional);
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
  } = useAuth0();

  // State initialisation
  const distanceOptions = [
    {value: 2, label: "5km"},
    {value: 5, label: "20km"},
    {value: 20, label: "50km"},
    {value: 50, label: "100km"},
    {value: 100, label: "200km"},
  ];

  const groupsOptions = formatGroups(groups);

  const sidebarOptions = [
    {value: "all", label: "All"},
    {value: "groups", label: "Groups"},
  ];

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [addToGroupModalOpen, setAddToGroupModalOpen] = useState(false);
  const [removeFromGroupModalOpen, setRemoveFromGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [groupActionsModalOpen, setGroupActionsModalOpen] = useState(false);
  const [groupEditable, setGroupEditable] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [authenticateModalOpen, setAuthenticateModalOpen] = useState(false);
  const [createFormName, setCreateFormName] = useState("");
  const [createFormDescription, setCreateFromDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSidebarOption, setSelectedSidebarOption] = useState(sidebarOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [latLngBounds, setLatLngBounds] = useState({});
  const [distance, setDistance] = useState(Object.values(distanceOptions)[1]);
  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [selectedProfessionals, setSelectedProfessionals] = useState(new Set());
  const [professionTypesSelections, setProfessionTypesSelections] = useState([]);
  const [selectedProfessionTypes, setSelectedProfessionTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLocationSelect = async (value, distance) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    // const latBounds = await Object.values(results[0].geometry.bounds.Ya);
    // const lngBounds = await Object.values(results[0].geometry.bounds.Ua);
    setLocationSelected(true);
    setLocationSearchTerm(value);
    let [latDelta, lngDelta] = kmToLatLng(distance.value, latLng.lat);
    setLatLngBounds({
      latitude: {min: latLng.lat - latDelta, max:latLng.lat + latDelta},
      longitude: {min: latLng.lng - lngDelta, max:latLng.lng + lngDelta}
    });
  };

  const handleLocationCancel = () => {
    setLocationSelected(false);
    setLocationSearchTerm("");
    setLatLngBounds({});
    document.getElementById("location-search-input").focus()
  };

  const handleDistanceChange = (distance) => {
    if (locationSelected) {
      handleLocationSelect(locationSearchTerm, distance).then(setDistance(distance));
    } else {
      setDistance(distance)
    }
  };

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

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedSidebarOption("groups");
  };

  const handleSidebarTitleSelection = (title) => {
    setSelectedSidebarOption(title);
    setSelectedGroup(null)
  };

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

  const handleEditGroup = (group) => {
    setEditGroupName(group.label);
    setEditGroupDescription(group.description);
    setGroupEditable(group.value)
  };

  const handleEditGroupSave = (group) => {
    setSelectedGroup({...selectedGroup, "label": editGroupName, "description": editGroupDescription});
    dispatch(editGroup(group.value, editGroupName, editGroupDescription));
    setGroupEditable(false);
  };

  const handleEditGroupCancel = () => {
    setEditGroupName("");
    setEditGroupDescription("");
    setGroupEditable(null)
  };

  useEffect(() => {
    if (!professionTypes) {
      dispatch(fetchProfessionTypes());
    }
  }, [professionTypesSelections]);

  useEffect(() => {
    if (Object.entries(groups).length === 0) {
      dispatch(fetchGroups());
    }
  }, [selectedGroup]);

  useEffect(() => {
    dispatch(fetchProfessionals(selectedProfessionTypes))
  }, [selectedProfessionTypes]);

  if (!professionTypesSelections.length && professionTypes) {
    let formattedProfessionTypes = formatProfessionTypes(professionTypes);
    setProfessionTypesSelections(formattedProfessionTypes);
  }

  if (professionTypesSelections.length > 0) {
    let filteredProfessionals = [];
    if (professionals) {
      let professionalsList = selectedGroup ? groups[selectedGroup.value]["professionals"] : professionals;
      filteredProfessionals = filterProfessionals(professionalsList, searchTerm, latLngBounds);
    }

    return (
      <div className="homepage">
        <div className="professional-body">
          <div className="search-container">
            <div className="professional-dropdown">
              <MultiSelect
                options={professionTypesSelections}
                value={selectedProfessionTypes}
                onChange={setSelectedProfessionTypes}
                labelledBy={"Select"}
                overrideStrings={{"selectSomeItems": "Select professions..."}}
              />
            </div>
            <span onChange={(e) => setSearchTerm(e.target.value)}>
              <input
                id="search-input"
                className="search-input"
                placeholder="Search by name, specialty, or clinic..."
              />
            </span>
            <div className="search-autocomplete">
              <PlacesAutocomplete
                value={locationSearchTerm}
                onChange={setLocationSearchTerm}
                onSelect={(location) => handleLocationSelect(location, distance)}
                searchOptions={{types: ["(cities)"], componentRestrictions: {country: ["au"]}}}
                debounce={200}
              >
                {({getInputProps, suggestions, getSuggestionItemProps}) => (
                  <div>
                    <div className="location-search-box">
                      <input
                        id="location-search-input"
                        className="location-search-input" {...getInputProps({placeholder: "Search by suburb..."})}
                        readOnly={!!locationSelected}
                      />
                      {locationSelected &&
                        <i className="fa fa-times" style={{fontSize: "20px", color: "grey", paddingTop: "7px"}} onClick={() => handleLocationCancel()}/>
                      }
                    </div>
                    <div className={suggestions.length > 0 ? "suggested-locations-box" : null}>
                      {suggestions.map(suggestion => {
                        const className = suggestion.active ? "suggested-location-active" : "suggested-location";
                        return (
                          <div {...getSuggestionItemProps(suggestion, {className})}>
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>
            {locationSelected &&
              <SingleDropdown
                options={distanceOptions}
                selectedValue={distance}
                onChange={handleDistanceChange}
                placeholder="Distance..."
                valuePrefix="within "
                />
            }
          </div>
          <div className="professional-results">
            {filteredProfessionals &&
              <div className="search-sidebar-container">
                <div className="search-sidebar">
                  <div className="search-sidebar-heading">SEARCH</div>
                  <div
                    className={"search-sidebar-section-text" +
                      (selectedSidebarOption === "all" ? " selected" : "")}
                    onClick={() => handleSidebarTitleSelection("all")}>
                    All
                  </div>
                  <div className="search-sidebar-groups">
                    <div className="sidebar-groups-heading" onClick={() => {isAuthenticated
                        ? handleSidebarTitleSelection("groups")
                        : setAuthenticateModalOpen(!authenticateModalOpen)}}>
                      <Modal
                        isOpen={authenticateModalOpen}
                        onRequestClose={() => setAuthenticateModalOpen(!authenticateModalOpen)}
                        style={authenticateCustomStyles}
                        contentLabel="Example Modal"
                      >
                        <AuthenticatePrompt
                          login={loginWithRedirect}
                          handleClose={() => setAuthenticateModalOpen(!authenticateModalOpen)}
                        />
                      </Modal>
                      <div
                        className={"search-sidebar-section-text" +
                        (selectedSidebarOption === "groups" ? " selected" : "")}
                        >
                        Groups
                      </div>
                      <i
                        className="fa fa-plus plus-icon"
                        aria-hidden="true"
                        onClick={() => setCreateGroupModalOpen(true)}
                      >
                      </i>
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
                    </div>
                    {groupsOptions.map((group) => {
                      return (
                        <div
                          className={"group-list-item" + (selectedGroup && group.value === selectedGroup.value ? " selected" : "")}
                          onClick={() => handleSelectGroup(group)}
                        >
                          <div>
                            {group.label}
                          </div>
                          {/*<i*/}
                            {/*className="fa fa-ellipsis-h sidebar-icon"*/}
                            {/*aria-hidden="true"*/}
                            {/*onClick={() => handleGroupOptions(group.value)}*/}
                          {/*/>*/}
                          <Modal
                            isOpen={groupActionsModalOpen}
                            onRequestClose={() => setGroupActionsModalOpen(!groupActionsModalOpen)}
                            style={groupActionsCustomStyles}
                            contentLabel="Example Modal"
                          >
                            <GroupActionsOptions
                              group={group}
                              handleSubmit={() => handleDeleteGroupConfirm(group)}
                              handleClose={() => setDeleteGroupModalOpen(!deleteGroupModalOpen)}
                            />
                          </Modal>
                        <Modal
                            isOpen={deleteGroupModalOpen}
                            onRequestClose={() => setDeleteGroupModalOpen(!deleteGroupModalOpen)}
                            style={deleteGroupCustomStyles}
                            contentLabel="Example Modal"
                          >
                            <DeleteGroupConfirmation
                              group={group}
                              handleSubmit={() => handleDeleteGroupConfirm(group)}
                              handleClose={() => setDeleteGroupModalOpen(!deleteGroupModalOpen)}
                            />
                          </Modal>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            }
            {filteredProfessionals.length || selectedSidebarOption === "groups"
              ? <div className="professionals-results-body">
                <div className="professional-list-container">
                  {selectedSidebarOption === "groups" && (selectedGroup && groupEditable === selectedGroup.value
                    ? <div className="group-summary-content">
                      <div className="group-summary-top edit">
                        <span onChange={(e) => setEditGroupName(e.target.value)}>
                          <input
                            id="search-input"
                            className="group-summary-title edit"
                            value={editGroupName}
                          />
                        </span>
                        <div className="group-edit-actions">
                          <div className="group-edit-save" onClick={() => handleEditGroupSave(selectedGroup)}>Save</div>
                          <i className="fa fa-times group-edit-cancel" onClick={handleEditGroupCancel}/>
                        </div>
                      </div>
                      <textarea
                        className="group-summary-description edit"
                        value={editGroupDescription}
                        onChange={(e) => setEditGroupDescription(e.target.value)}
                      />
                    </div>
                    : selectedGroup &&
                      <div className="group-summary-content">
                      <div className="group-summary-top">
                        <div className="group-summary-title">{selectedGroup.label}</div>
                        <i className="fa fa-edit group-edit" onClick={() => handleEditGroup(selectedGroup)}/>
                      </div>
                      <div className="group-summary-description">{selectedGroup.description}</div>
                    </div>
                  )}
                  <div className="professional-list-actions">
                    <i className="fa fa-square-o selection-action"/>
                    <div className="selection-action-text">Actions</div>
                    {selectedSidebarOption === "groups" &&
                      <i onClick={() => setRemoveFromGroupModalOpen(!removeFromGroupModalOpen)}
                        className="fa fa-trash selection-action-delete"/>
                    }
                    {/*<i className="fa fa-share-alt selection-action-share"/>*/}
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
                    <i
                      className="fa fa-plus selection-action-group-add"
                      // Need to add professional to group
                      onClick={() => setAddToGroupModalOpen(!addToGroupModalOpen)}/>
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
                  </div>
                  <ul className="professional-list">
                    {filteredProfessionals.map((professional) => {
                      return (
                        <ProfessionalListItem
                          currentProfessional={currentProfessional}
                          professional={professional}
                          professionals={filteredProfessionals}
                          setCurrentProfessional={setCurrentProfessional}
                          selectedProfessionals={selectedProfessionals}
                          handleSelectedProfessional={handleSelectedProfessional}
                        />
                      )
                    })}
                  </ul>
                </div>
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

export default HomePage;
