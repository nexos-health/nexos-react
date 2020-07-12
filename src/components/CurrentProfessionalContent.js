import React from "react";


export const CurrentProfessionalContent = ({currentProfessional}) => {
  return (
    <div className="current-professional">
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
              <span>
                Address: {clinic.streetNumber} {clinic.streetName} {clinic.suburb}, {clinic.state}, {clinic.postcode}
                </span>
            </div>
          )
        })}
      </div>
    </div>
  )
};
