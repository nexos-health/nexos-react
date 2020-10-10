import React, {useState} from "react";
import {Button} from "./Button";
import {BaseButton, ButtonContainer} from "./BaseStyledComponents";

export const DeleteGroupConfirmation = ({group, handleSubmit, handleClose}) => {
  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Are you sure you wish to delete the group "{group.label}"</text>
      </div>
      <div className="move-to-modal-actions">
        <ButtonContainer><BaseButton secondary onClick={handleClose}>Cancel</BaseButton></ButtonContainer>
        <ButtonContainer><BaseButton onClick={() => handleSubmit(group)}>Confirm</BaseButton></ButtonContainer>
      </div>
    </div>
  )
};
