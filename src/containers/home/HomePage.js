import React, { useState, useEffect } from 'react';
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
  createGroup,
  fetchGroups
} from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";
import Modal from "react-modal";
import {CreateGroupForm} from "../../components/CreateGroupForm";


Modal.setAppElement('#root');


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
    filteredProfessionals = filteredProfessionals.filter(professional =>
      (professional.firstName && professional.firstName.toLowerCase().indexOf(searchLower) >= 0) ||
      (professional.lastName && professional.lastName.toLowerCase().indexOf(searchLower) >= 0) ||
      (professional.description && professional.description.toLowerCase().indexOf(searchLower) >= 0)
      // (professional.notes && professional.notes.toLowerCase().indexOf(searchLower) >= 0)
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
  return formattedGroups;
};


const HomePage = () => {
  // Redux state initialisation
  const account = useSelector(state => state.account.accountDetails);
  const professionals = useSelector(state => state.professionals.professionals);
  const professionTypes = useSelector(state => state.professionals.professionTypes);
  const groups = useSelector(state => state.professionals.groups);
  // const currentProfessional = useSelector(state => state.professionals.currentProfessional);
  const dispatch = useDispatch();

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

  const handleAddProfessionalsToGroup = (group) => {
    addProfessionalsToGroup(selectedProfessionals, group);
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
            <SingleDropdown
              options={distanceOptions}
              selectedValue={distance}
              onChange={handleDistanceChange}
              placeholder="Distance..."
              valuePrefix="within "
            />
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
                    <div className="sidebar-groups-heading" onClick={() => handleSidebarTitleSelection("groups")}>
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
                          <i
                            className="fa fa-ellipsis-h sidebar-icon"
                            aria-hidden="true"
                            onClick={() => handleGroupOptions(group.value)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            }
            {filteredProfessionals.length
              ? <div className="professionals-results-body">
                <div className="professional-list-container">
                  {selectedSidebarOption === "groups" &&
                    <div className="group-summary">
                      <div className="group-summary-title">{selectedGroup.label}</div>
                      <div className="group-summary-description">{selectedGroup.description}</div>
                    </div>
                  }
                  <div className="professional-list-actions">
                    <i className="fa fa-square-o selection-action"/>
                    <div className="selection-action-text">Actions</div>
                    {selectedSidebarOption === "groups" && <i className="fa fa-trash selection-action-delete"/>}
                    {/*<i className="fa fa-share-alt selection-action-share"/>*/}
                    <i
                      className="fa fa-plus selection-action-group-add"
                      // Need to add professional to group
                      onClick={handleAddProfessionalsToGroup}/>
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
