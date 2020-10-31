import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import styled, {css} from 'styled-components/macro';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { geocodeByPlaceId, getLatLng } from "react-places-autocomplete";

import './Home.css';
import {
  fetchProfessionTypes,
  fetchProfessionals,
  addProfessionalsToGroup,
  createGroup,
  fetchGroups,
  fetchFavourites
} from "../../redux/actions/professional";
import {kmToLatLng} from "../../utils/helpers";
import Modal from "react-modal";
import {CreateGroupForm} from "../../components/CreateGroupForm";
import {useAuth0} from "../../react-auth0-spa";
import {
  BaseButton,
  FlexColumn,
  FlexRow,
  IconButton,
  BoldedText,
  Text,
  ParagraphText,
  SearchInput,
  SearchBarContainer
} from "../../components/BaseStyledComponents";
import {fetchPlaces} from "../../utils/api";
import SearchResults from "./SearchResults";

Modal.setAppElement('#root');


const createGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    height                : '305px',
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
  let filteredProfessionals = Object.values(professionals);
  if (searchTerm && searchTerm.trim() !== "") {
    let searchLower = searchTerm.toLowerCase();
    filteredProfessionals = filteredProfessionals.filter(professional => {
        let firstName = professional.firstName && professional.firstName.toLowerCase();
        let lastName = professional.lastName && professional.lastName.toLowerCase();

        return (
          (firstName && firstName.indexOf(searchLower) >= 0) ||
          (lastName && lastName.indexOf(searchLower) >= 0) ||
          (firstName && lastName && `${firstName} ${lastName}`.indexOf(searchLower) >= 0) ||
          (professional.description && professional.description.toLowerCase().indexOf(searchLower) >= 0) ||
          (professional.userNotes && professional.userNotes.toLowerCase().indexOf(searchLower) >= 0)
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
    const aName = a.firstName;
    const bName = b.firstName;
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
  const [removeFromGroupModalOpen, setRemoveFromGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [createFormName, setCreateFormName] = useState("");
  const [createFormDescription, setCreateFromDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [latLngBounds, setLatLngBounds] = useState({});
  const [distance, setDistance] = useState(Object.values(distanceOptions)[2]);
  const [selectedProfessionals, setSelectedProfessionals] = useState(new Set());
  const [favouritesToggle, setFavouritesToggle] = useState(false);
  const [professionTypesSelections, setProfessionTypesSelections] = useState([]);
  const [selectedProfessionTypes, setSelectedProfessionTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLocationSelect = async (action, location, distance) => {
    if (action.action === 'clear') {
      handleLocationCancel();
      return
    }
    const results = await geocodeByPlaceId(location.value);
    const latLng = await getLatLng(results[0]);
    // const latBounds = await Object.values(results[0].geometry.bounds.Ya);
    // const lngBounds = await Object.values(results[0].geometry.bounds.Ua);
    let [latDelta, lngDelta] = kmToLatLng(distance.value, latLng.lat);
    setLatLngBounds({
      latitude: {min: latLng.lat - latDelta, max:latLng.lat + latDelta},
      longitude: {min: latLng.lng - lngDelta, max:latLng.lng + lngDelta}
    });
  };

  const handleLocationCancel = () => {
    setLatLngBounds({});
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

  useEffect(() => {
    if (!professionTypes) {
      dispatch(fetchProfessionTypes());
    }
  }, [professionTypesSelections]);

  // useEffect(() => {
  //   if (Object.entries(groups).length === 0) {
  //     dispatch(fetchGroups());
  //   }
  // }, []);

  useEffect(() => {
    if (Object.entries(groups).length === 0 && isAuthenticated) {
      dispatch(fetchFavourites());
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
          <SearchContainer>
            <SearchProfessionType>
              <SearchAreaTitle>Professions</SearchAreaTitle>
              <ProfessionTypeDropdown>
                <Select
                  options={professionTypesSelections}
                  value={selectedProfessionTypes}
                  onChange={setSelectedProfessionTypes}
                  styles={customStyles}
                  closeMenuOnSelect={false}
                  isMulti
                  isSearchable
                  name="profession"
                  placeholder="Select professions..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </ProfessionTypeDropdown>
            </SearchProfessionType>
            <SearchKeyword>
              <SearchAreaTitle>Keyword</SearchAreaTitle>
              <SearchBarContainer onChange={(e) => setSearchTerm(e.target.value)}>
                <SearchInput placeholder="Search by name, specialty, or clinic..."/>
              </SearchBarContainer>
            </SearchKeyword>
            <SearchLocation>
              <SearchAreaTitle>Location</SearchAreaTitle>
              <LocationSearchBarContainer>
                <AsyncSelect
                  onChange={(location, action) => handleLocationSelect(action, location, distance)}
                  loadOptions={fetchPlaces}
                  styles={customStyles}
                  components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                  isSearchable
                  isClearable
                  name="location"
                  placeholder="Search by suburb..."
                />
              </LocationSearchBarContainer>
              <DistanceContainer hide={Object.keys(latLngBounds).length === 0}>
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
              </DistanceContainer>
            </SearchLocation>
          </SearchContainer>
          <SearchResults
            groupsOptions={groupsOptions}
            groups={groups}
            favouritesToggle={favouritesToggle}
            setFavouritesToggle={setFavouritesToggle}
            filteredProfessionals={filteredProfessionals}
            selectedProfessionals={selectedProfessionals}
            setSelectedProfessionals={setSelectedProfessionals}
            handleSelectedProfessional={handleSelectedProfessional}
          />
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

export const SearchContainer = styled(FlexRow)`
  width: 100%;
  justify-content: center;
  padding: 0 0 50px 0;
`;

const SearchAreaTitle = styled(Text)`
  font-size: 20px;
  font-weight: 800;
  color: #766F6F;
  padding-bottom: 10px;
`;

const SearchProfessionType = styled(FlexColumn)`
  padding-right: 20px;
`;

const SearchKeyword= styled(FlexColumn)`
  padding-right: 20px;
`;

const SearchLocation = styled(FlexColumn)`
  width: 300px;
`;

const LocationSearchBarContainer = styled(SearchBarContainer)`
  padding: 0;
  color: #6d6d6d;
  font-size: 0.9em;
`;

const ProfessionTypeDropdown = styled(FlexColumn)`
  align-items: center;
  justify-content: center;
  color: #6d6d6d;
  width: 400px;
  padding: 0 0 25px 0;
  font-size: 0.9em;
  min-width: 250px;
`;

const DistanceContainer = styled.div`
  width: 140px;
  font-size: 0.9em;
  color: hsl(0,0%,50%);
  align-self: flex-end;
  padding-top: 5px;
  ${props => props.hide && css`
    opacity: 0;
  `}
`;
