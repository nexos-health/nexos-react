import React from "react";
import styled, {css} from "styled-components";

import {FlexColumn, BoldedText} from "../components/BaseStyledComponents";
import {FlexRow, OverflowText, ParagraphText} from "./BaseStyledComponents";


export const ProfessionalListItem = ({currentProfessional: current, professional, professionals, setCurrentProfessional, selectedProfessionals=null, handleSelectedProfessional=null}) => {
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
      <ProfessionalInfoContainer active={current && professional.uid === current.uid}
       onClick={() => setCurrentProfessional(professionals.filter(item => item.uid === professional.uid)[0])}>
        <FlexRow>
          <ProfessionalName>{professional.firstName} {professional.lastName}</ProfessionalName>
          <ProfessionalWaitTime>{professional.waitTimes}</ProfessionalWaitTime>
        </FlexRow>
        <ProfessionalDescription>{professional.description}</ProfessionalDescription>
        <ProfessionalExtras>Fees: {professional.fees}</ProfessionalExtras>
        <ProfessionalExtras>BB: {professional.bulkBilling}</ProfessionalExtras>
      </ProfessionalInfoContainer>
    </li>
  )
};

const ProfessionalInfoContainer = styled(FlexColumn)`
  justify-content: space-around;
  flex-grow: 2;
  width: 80%;
  border-bottom: 1px solid dimgrey;
  padding: 10px 20px 10px 0;
  ${props => props.active && css`
      background-color: #dbe2e9;
  `}
`;

const ProfessionalName = styled(OverflowText)`
  padding: 10px 0 0 10px;
  color: black;
  flex-grow: 1;
`;

const ProfessionalExtras = styled(OverflowText)`
  color: darkgray;
  padding: 0 0 5px 10px;
  font-size: 13px;
`;

const ProfessionalDescription = styled(OverflowText)`
  color: darkgray;
  flex-grow: 4;
  padding: 10px 0 0 10px;
  height: 100px;
  max-width: 100%;
`;

const ProfessionalWaitTime = styled(OverflowText)`
  color: black;
  padding-top: 14px;
  font-size: 12px;
  max-width: 100px;
`;
