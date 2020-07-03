import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MultiSelect from "react-multi-select-component";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import logo from '../../assets/logo.svg';
import './Groups.css';
import SingleDropdown from "../../components/SingleDropdown";
import { fetchGroups, fetchProfessionTypes, fetchProfessionals, fetchProfessional } from "../../redux/actions/professional";
import { login } from "../../redux/actions/account";
import {kmToLatLng} from "../../utils/helpers";


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
  Object.entries(groups).forEach(([id, group]) => {
    formattedGroups.push({value: id, label: group.displayName})
  });
  return formattedGroups;
};

const Groups = () => {
  // Redux state initialisation
  const groups = useSelector(state => state.professionals.groups);
  const dispatch = useDispatch();

  // State initialisation
  const groupsOptions = formatGroups(groups);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (Object.entries(groups).length === 0) {
      dispatch(fetchGroups());
    }
  }, [selectedGroup]);

  if (Object.entries(groups).length > 0) {
    let filteredProfessionals = [];
    if (selectedGroup) {
      filteredProfessionals = filterProfessionals(groups[selectedGroup.value]["professionals"], searchTerm);
    }
    return (
      <div className="homepage">
        <div className="professional-body">
          <div className="search-container">
            <div className="dropdown-container">
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
                        onClick={() => setCurrentProfessional(
                          filteredProfessionals.filter(item => item.id === professional.id)[0]
                        )
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

export default Groups;
