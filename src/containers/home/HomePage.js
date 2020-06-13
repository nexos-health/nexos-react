import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MultiSelect from "react-multi-select-component";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import logo from '../../assets/logo.svg';
import './HomePage.css';
import SingleDropdown from "../../components/SingleDropdown";
import { fetchProfessionTypes, fetchProfessionals, fetchProfessional, favouriteProfessional } from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";

const formatProfessionTypes = (professionTypes) => {
  let formattedProfessionTypes = professionTypes.map((professionType) => {
    return (
      {
        "value": professionType.id,
        "label": professionType.name,
      }
    )
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

const HomePage = () => {
  // Redux state initialisation
  const account = useSelector(state => state.account.accountDetails);
  const professionals = useSelector(state => state.professionals.professionals);
  const professionTypes = useSelector(state => state.professionals.professionTypes);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [latLngBounds, setLatLngBounds] = useState({});
  const [distance, setDistance] = useState(Object.values(distanceOptions)[1]);
  const [currentProfessional, setCurrentProfessional] = useState(null);
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

  useEffect(() => {
    if (!professionTypes) {
      dispatch(fetchProfessionTypes());
    }
  }, [professionTypesSelections]);

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
      filteredProfessionals = filterProfessionals(professionals, searchTerm, latLngBounds);
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
            {filteredProfessionals.length
              ? <div className="professionals-results-body">
                <ul className="professional-list">
                  {filteredProfessionals.map((professional) => {
                    return (
                      <li
                        className={
                          currentProfessional && professional.id === currentProfessional.id
                            ? "active-professional-list-item" : "professional-list-item"
                        }
                        onClick={() => setCurrentProfessional(professionals.filter(item => item.id === professional.id)[0])
                      }>
                        <div className="professional-info">
                          <div className="professional-top-row">
                            <div className="professional-name">
                              {professional.firstName} {professional.lastName}
                            </div>
                            <span className="professional-wait-time">{professional.waitTimes}</span>
                          </div>
                          <div className="professional-description">
                            {professional.description}
                          </div>
                          <span className="professional-extras">Fees: {professional.fees}</span>
                          <span className="professional-extras">BB: {professional.bulkBilling}</span>
                        </div>
                        <div className="professional-favourite">
                          <img src={logo} className="favourite" alt="logo"/>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div className="current-professional-box">
                  {currentProfessional && filteredProfessionals.indexOf(currentProfessional) >= 0
                    ? <div className="current-professional">
                      <span className="current-professional-name">
                        {currentProfessional.firstName} {currentProfessional.lastName}
                      </span>
                      <span className="current-professional-description">
                        {currentProfessional.description}
                      </span>
                      <span className="current-professional-extras">
                        <b>Wait Time:</b> {currentProfessional.waitTimes}
                      </span>
                      <span className="current-professional-extras">
                        <b>Fees:</b> {currentProfessional.fees}
                      </span>
                      <span className="current-professional-extras">
                        <b>Bulk Billing:</b> {currentProfessional.bulkBilling}
                      </span>
                      <div className="current-professional-clinics">
                        <span><b>Clinics</b></span>
                        {currentProfessional.clinics.map((clinic) => {
                          return (
                            <div className="current-professional-clinic">
                              <span>{clinic.clinicName}</span>
                              <span>Phone: {clinic.phone}</span>
                              <span>Fax: {clinic.fax}</span>
                              <span>Address: {clinic.streetNumber} {clinic.streetName} {clinic.suburb}, {clinic.state}, {clinic.postcode}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
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
