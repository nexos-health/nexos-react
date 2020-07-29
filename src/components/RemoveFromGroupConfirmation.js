import React, {useState} from "react";
import {Button} from "./Button";

export const RemoveFromGroupConfirmation = ({group, selectedProfessionals, handleSubmit, handleClose}) => {

  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Are you sure you wish to remove the selected {selectedProfessionals.length} from "{group.label}"</text>
      </div>
      <div className="move-to-modal-actions">
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
