import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import styled, {css} from 'styled-components';
import Select, { components } from 'react-select'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import './Home.css';
import {
  fetchProfessionTypes,
  fetchProfessionals,
  addProfessionalsToGroup,
  createGroup,
  fetchGroups,
} from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";
import Modal from "react-modal";
import {CreateGroupForm} from "../../components/CreateGroupForm";
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {RemoveFromGroupConfirmation} from "../../components/RemoveFromGroupConfirmation";
import {useAuth0} from "../../react-auth0-spa";
import {AuthenticatePrompt} from "../../components/AuthenticatePrompt";
import {
  BaseButton,
  FlexColumn,
  FlexRow,
  IconButton,
  BoldedText,
  ParagraphText
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


const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: "100%"
  }),
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


const Home = () => {
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


  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [addToGroupModalOpen, setAddToGroupModalOpen] = useState(false);
  const [removeFromGroupModalOpen, setRemoveFromGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [createFormName, setCreateFormName] = useState("");
  const [createFormDescription, setCreateFromDescription] = useState("");
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

  const handleAddProfessionalsToGroupSubmit = (group) => {
    dispatch(addProfessionalsToGroup(selectedProfessionals, group.value));
    setAddToGroupModalOpen(false);
    setSelectedProfessionals(new Set());
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
  }, []);

  useEffect(() => {
    dispatch(fetchProfessionals(selectedProfessionTypes || []))
  }, [selectedProfessionTypes]);

  if (!professionTypesSelections.length && professionTypes) {
    let formattedProfessionTypes = formatProfessionTypes(professionTypes);
    setProfessionTypesSelections(formattedProfessionTypes);
  }

  if (professionTypesSelections.length > 0) {
    let filteredProfessionals = [];
    if (professionals) {
      filteredProfessionals = filterProfessionals(professionals, searchTerm, latLngBounds);
    }

    return (
      <div className="homepage">
        <div className="professional-body">
          <div className="search-container">
            <div className="professional-dropdown">
              <Select
                options={professionTypesSelections}
                value={selectedProfessionTypes}
                onChange={setSelectedProfessionTypes}
                styles={customStyles}
                isMulti
                isSearchable
                name="profession"
                placeholder="Select professions"
                className="basic-multi-select"
                classNamePrefix="select"
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
            <DistanceContainer>
              {locationSelected &&
                <Select
                  options={distanceOptions}
                  value={distance}
                  onChange={handleDistanceChange}
                  placeholder="Distance..."
                  style={customStyles}
                  components={{
                    SingleValue: ({ children, ...props }) => {
                      return (
                        <components.SingleValue {...props}>
                          {"within " + children}
                        </components.SingleValue>
                      );
                    },
                    Placeholder: ({ children, ...props }) => {
                      return (
                        <components.Placeholder {...props}>
                          {"within " + children}
                        </components.Placeholder>
                      );
                    },
                    IndicatorSeparator: () => null,
                  }}
                  />
              }
            </DistanceContainer>
          </div>
          <div className="professional-results">
            <ProfessionalResultsContainer>
              <ProfessionalResultsListContainer>
                <ProfessionalListActions>
                  <i className="fa fa-square-o selection-action"/>
                  <TitleText>Actions</TitleText>
                  <i onClick={() => setRemoveFromGroupModalOpen(!removeFromGroupModalOpen)}
                     className="fa fa-trash selection-action-delete"/>
                  <i className="fa fa-plus selection-action-group-add"
                     onClick={() => setAddToGroupModalOpen(true)}/>
                  {/*<i className="fa fa-share-alt selection-action-share"/>*/}
                </ProfessionalListActions>
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
              </ProfessionalResultsListContainer>
              <CurrentProfessionalContainer>
                {currentProfessional && filteredProfessionals.indexOf(currentProfessional) >= 0
                  ? <CurrentProfessionalContent currentProfessional={currentProfessional}/>
                  : <NoCurrentProfessionalContainer>No Professional Selected</NoCurrentProfessionalContainer>
                }
              </CurrentProfessionalContainer>
            </ProfessionalResultsContainer>
          </div>
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
      </div>
    );
  } else {
    return null
  }
};

export default Home;

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
`;

const GroupsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 30px 80px 30px;
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
  font-size: x-small;
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
