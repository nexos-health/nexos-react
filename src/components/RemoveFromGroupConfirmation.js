import React from "react";
import {BaseButton, ButtonContainer, FlexRow} from "./BaseStyledComponents";
import styled from "styled-components";

export const RemoveFromGroupConfirmation = ({group, selectedProfessionals, handleSubmit, handleClose}) => {
  let count = selectedProfessionals.size;
  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Are you sure you wish to remove {count} {count === 1 ? "professional" : "professionals"} from "{group.label}"</text>
      </div>
      <ActionsContainer>
        <ButtonContainer><BaseButton secondary onClick={handleClose}>Cancel</BaseButton></ButtonContainer>
        <ButtonContainer><BaseButton onClick={() => handleSubmit(group)}>Confirm</BaseButton></ButtonContainer>
      </ActionsContainer>
    </div>
  )
};

const ActionsContainer = styled(FlexRow)`
  justify-content: flex-end;
  padding: 16px 0 0 0;
`;
