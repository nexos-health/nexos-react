import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MultiSelect from "react-multi-select-component";

import logo from '../../logo.svg';
import { fetchProfessionTypes, fetchProfessionals, fetchProfessional, favouriteProfessional } from "../../redux/actions/professional";
import './HomePage.css';

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

export const HomePage = () => {
  // Redux state initialisation
  const professionals = useSelector(state => state.professionals.professionals);
  const professionTypes = useSelector(state => state.professionals.professionTypes);
  const currentProfessional = useSelector(state => state.professionals.currentProfessional);
  const dispatch = useDispatch();

  // Location state initialisation
  const [searchTerm, setSearchTerm] = useState("");
  const [professionTypesSelections, setProfessionTypesSelections] = useState([]);
  const [selectedProfessionTypes, setSelectedProfessionTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!professionTypes) {
      dispatch(fetchProfessionTypes());
    }
  });

  if (!professionTypesSelections.length && professionTypes) {
    let formattedProfessionTypes = formatProfessionTypes(professionTypes);
    setProfessionTypesSelections(formattedProfessionTypes);
  }

  if (professionTypesSelections.length > 0) {
    let filteredProfessionals = [];
    if (professionals) {
      filteredProfessionals = filterProfessionals(professionals, searchTerm);
    }
    return (
      <div className="homepage">
        <header className="homepage-header"/>
        <div className="professional-body">
          <div className="search-container">
            <div className="professional-dropdown" onBlur={() => dispatch(fetchProfessionals(selectedProfessionTypes))}>
              <MultiSelect
                options={professionTypesSelections}
                value={selectedProfessionTypes}
                onChange={setSelectedProfessionTypes}
                labelledBy={"Select"}
                overrideStrings={{"selectSomeItems": "Select professions..."}}
              />
            </div>
            <span
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <input
                className="search-input"
                placeholder="Search professionals by name, location, or clinic..."
              />
            </span>
          </div>
          {professionals
            ? <ul className="professional-list">
              {filteredProfessionals.map((professional) => {
                return (
                  <li className="professional-list-item" onClick={() => dispatch(fetchProfessional(professional.id))}>
                    <div className="professional-info">
                      <div className="professional-name">
                        {professional.firstName} {professional.lastName}
                      </div>
                      <div className="professional-description">
                        {professional.description}
                      </div>
                    </div>
                    <div className="professional-favourite">
                      <img src={logo} className="favourite" alt="logo"/>
                    </div>
                  </li>
                )
              })}
            </ul>
            : null
          }
        </div>
      </div>
    );
  } else {
    return null
  }
};
