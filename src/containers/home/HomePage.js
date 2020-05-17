import React, { Component } from 'react';
import { connect } from 'react-redux'
import logo from '../../logo.svg';
import './HomePage.css';
import * as professionalActions from "../../redux/actions/professional";
import {bindActionCreators} from "redux/es/redux";

const mapStateToProps = state => ({
  professionals: state.professionals.active,
  currentProfessional: state.professionals.currentProfessional
});

const mapDispatchToProps = dispatch => {
  return {
    professionalActions: bindActionCreators(professionalActions, dispatch)
  }
};


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      errorMessage: ""
    };
  }

  componentDidMount = () => {
    this.props.professionalActions.fetchProfessionals();
  };

  handleOnRowClick = (id) => {
    this.props.professionalActions.fetchProfessional(id);
  };

  handleOnFavouriteClick = (id) => {
    this.props.professionalActions.favouriteProfessional(id);
  };

  handleFieldOnChange = (field, value) => {
    this.setState({[field]: value})
  };
  
  filterProfessionals = () => {
    let filteredProfessionals = this.props.professionals;
    const searchTerm = this.state.searchTerm;

    if (searchTerm && searchTerm.trim() !== "") {
      let searchLower = searchTerm.toLowerCase();
      filteredProfessionals = filteredProfessionals.filter(professional =>
        (professional.first_name && professional.first_name.toLowerCase().indexOf(searchLower) >= 0) ||
        (professional.last_name && professional.last_name.toLowerCase().indexOf(searchLower) >= 0) ||
        (professional.description && professional.description.toLowerCase().indexOf(searchLower) >= 0) ||
        (professional.notes && professional.notes.toLowerCase().indexOf(searchLower) >= 0)
      );
    }

    filteredProfessionals.sort((a, b) => {
      const aName = a.first_name;
      const bName = b.last_name;
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });

    return filteredProfessionals;
  };

  render() {
    let professionals = this.props.professionals;
    if (professionals) {
      let filteredProfessionals = this.filterProfessionals();
      return (
        <div className="homepage">
          <header className="homepage-header"/>
          <div className="professional-body">
            <div className="search-container">
              <span
                onChange={(e) => this.handleFieldOnChange("searchTerm", e.target.value)}
              >
                <input
                  className="search-input"
                  placeholder="Search by name, specialty, or location ..."
                />
              </span>
            </div>
            <ul className="professional-list">
            {filteredProfessionals.map((professional) => {
              return (
                <li className="professional-list-item" onClick={() => this.handleOnRowClick(professional.id)}>
                  <div className="professional-info">
                    <div className="professional-name">
                      {professional.first_name} {professional.last_name}
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
          </div>
        </div>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
