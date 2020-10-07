import React, {useState} from "react";
import {Button} from "./Button";
import {BaseButton} from "./BaseStyledComponents";

export const RemoveFromGroupConfirmation = ({group, selectedProfessionals, handleSubmit, handleClose}) => {
  let count = selectedProfessionals.size;
  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Are you sure you wish to remove {count} {count === 1 ? "professional" : "professionals"} from "{group.label}"</text>
      </div>
      <div className="remove-from-group-actions">
        <div className="cancel-button-container">
          <BaseButton secondary onClick={handleClose}>Cancel</BaseButton>
        </div>
        <div className="submit-button-container">
          <BaseButton onClick={() => handleSubmit(group)}>Confirm</BaseButton>
        </div>
      </div>
    </div>
  )
};
