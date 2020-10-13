import React from "react";
import styled, { css } from 'styled-components/macro';

import {FlexColumn, ParagraphText} from "./BaseStyledComponents";


export const CurrentProfessionalContent = ({currentProfessional}) => {
  return (
    <FlexColumn>
      <span className="current-professional-name">
        {currentProfessional.firstName} {currentProfessional.lastName}
      </span>
      <CurrentProfessionalDescription>
        {currentProfessional.description}
      </CurrentProfessionalDescription>
      <span className="current-professional-extras">
        <b>Wait Time:</b> {currentProfessional.waitTimes}
      </span>
      <span className="current-professional-extras">
        <b>Fees:</b> {currentProfessional.fees}
      </span>
      <span className="current-professional-extras">
        <b>Bulk Billing:</b> {currentProfessional.bulkBilling}
      </span>
      <ClinicsContainer>
        <span><b>Clinics</b></span>
        {currentProfessional.clinics.map((clinic) => {
          return (
            <ClinicContainer>
              <span>{clinic.clinicName}</span>
              <span>Phone: {clinic.phone}</span>
              <span>Fax: {clinic.fax}</span>
              <span>
                Address: {clinic.streetNumber} {clinic.streetName} {clinic.suburb}, {clinic.state}, {clinic.postcode}
                </span>
            </ClinicContainer>
          )
        })}
      </ClinicsContainer>
    </FlexColumn>
  )
};


const CurrentProfessionalDescription = styled(ParagraphText)`
  color: darkgray;
  padding: 0 0 10px 0;
`;

const ClinicContainer = styled(FlexColumn)`
  justify-content: space-around;
  padding-top: 20px;
  font-size: small;
`;

const ClinicsContainer = styled.div`
  padding: 25px 0 10px 0;
`;

