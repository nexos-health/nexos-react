import React from "react";

export const ProfessionalListItem = ({currentProfessional, professional, professionals, setCurrentProfessional, selectedProfessionals=null, handleSelectedProfessional=null}) => {
  return (
    <li className="professional-list-item">
      {selectedProfessionals &&
        <div className="checkbox-selection-container">
          <i className={"fa fa-" + (selectedProfessionals.has(professional.uid)
            ? "check-square"
            : "square-o")}
             style={{"font-size": "larger"}}
             onClick={() => handleSelectedProfessional(professional.uid)}
             aria-hidden="true"/>
        </div>
      }
      <div className={currentProfessional && professional.uid === currentProfessional.uid
        ? "active-professional-info" : "professional-info"}
           onClick={() => setCurrentProfessional(professionals.filter(item => item.uid === professional.uid)[0])
           }>
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
    </li>
  )
};