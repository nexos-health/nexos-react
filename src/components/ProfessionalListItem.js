import React from "react";
import styled, { css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {FlexColumn, FlexRow, OverflowText, ParagraphText} from "./BaseStyledComponents";


export const ProfessionalListItem = ({currentProfessional: current, professional, professionals, handleCurrentProfessional, favourites, handleFavourProfessional, setSignInModalOpen, selectedProfessionals=null, handleSelectedProfessional=null}) => {
  const favoured = favourites && favourites.professionalsUids.indexOf(professional.uid) > 0;
  return (
    <ProfessionalListItemWrapper>
      {/*{selectedProfessionals &&*/}
        {/*<div className="checkbox-selection-container">*/}
          {/*<i className={"fa fa-" + (selectedProfessionals.has(professional.uid) ? "check-square" : "square-o")}*/}
             {/*style={{"font-size": "larger"}}*/}
             {/*onClick={() => handleSelectedProfessional(professional.uid)}*/}
             {/*aria-hidden="true"/>*/}
        {/*</div>*/}
      {/*}*/}
      <div className="checkbox-selection-container">
        <StarIcon
          favoured={favoured}
          icon={[favoured ? "fas" : "far", "star"]}
          onClick={favourites ? () => handleFavourProfessional(professional.uid) : () => setSignInModalOpen(true)}/>
      </div>
      <ProfessionalInfoContainer active={current && professional.uid === current.uid}
       onClick={() => handleCurrentProfessional(professionals, professional)}>
        <ProfessionalTopLine>
          <ProfessionalName>{professional.firstName} {professional.lastName}</ProfessionalName>
          <ProfessionType>{professional.professionType}</ProfessionType>
        </ProfessionalTopLine>
        <ProfessionalDescription>{professional.description}</ProfessionalDescription>
        <ProfessionalExtras>Fees: {professional.fees}</ProfessionalExtras>
        <ProfessionalExtras>BB: {professional.bulkBilling}</ProfessionalExtras>
        <ProfessionalExtras>Wait: {professional.waitTimes}</ProfessionalExtras>
      </ProfessionalInfoContainer>
    </ProfessionalListItemWrapper>
  )
};


const ProfessionalListItemWrapper = styled(FlexRow)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 190px;
  justify-content: space-between;
  list-style-position: inside;
`;

const ProfessionalInfoContainer = styled(FlexColumn)`
  justify-content: space-around;
  flex-grow: 2;
  width: 80%;
  border-bottom: 1px solid #f5e8e8;
  padding: 10px 20px 10px 0;
  ${props => props.active && css`
      background-color: #dbe2e9;
  `}
  &:hover {
    cursor: pointer;
  }
`;

const StarIcon = styled(FontAwesomeIcon)`
  &:hover {
    cursor: pointer
  }
  ${props => props.favoured && css`
    color: gold;
  `}
`;

const ProfessionalTopLine = styled(FlexRow)`
  padding: 10px 0 0 10px;
`;

const ProfessionalName = styled(OverflowText)`
  color: black;
  flex-grow: 1;
`;

const ProfessionalExtras = styled(OverflowText)`
  color: darkgray;
  padding: 0 0 0 10px;
  font-size: 13px;
`;

const ProfessionalDescription = styled(OverflowText)`
  color: darkgray;
  flex-grow: 4;
  padding: 10px 0 0 10px;
  height: 100px;
  max-width: 100%;
`;

const ProfessionType = styled(OverflowText)`
  color: black;
  padding: 0 5px 0 0;
  font-size: 12px;
  font-weight: 600;
  max-width: 200px;
  align-self: flex-end;
`;
