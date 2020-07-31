import React, {useState} from "react";
import {Button} from "./Button";

export const RemoveFromGroupConfirmation = ({group, selectedProfessionals, handleSubmit, handleClose}) => {
  let count = selectedProfessionals.size;
  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Are you sure you wish to remove {count} {count === 1 ? "professional" : "professionals"} from "{group.label}"</text>
      </div>
      <div className="remove-from-group-actions">
        <div className="cancel-button-container">
          <Button
            text="Cancel"
            onPress={handleClose}
            style={{"color": "darkslategrey", "backgroundColor": "white"}}
          />
        </div>
        <div className="submit-button-container">
          <Button text="Confirm" onPress={() => handleSubmit(group)}/>
        </div>
      </div>
    </div>
  )
};
