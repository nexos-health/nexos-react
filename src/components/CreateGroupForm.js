import React from "react";
import {Button} from "./Button";

export const CreateGroupForm = ({groupName, groupDescription, setGroupName, setGroupDescription, handleSubmit, handleClose}) => {
  return (
    <div className="create-group-modal">
      <div className="create-form-name">
        <text>Name</text>
        <span onChange={(e) => setGroupName(e.target.value)}>
          <input
            id="search-input"
            className="name-input"
          />
        </span>
      </div>
      <div className="create-form-description">
        <text>Description</text>
        <div>
          <textarea
            className="description-input"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-actions">
        <div className="cancel-button-container">
          <Button
            text="Cancel"
            onPress={handleClose}
            style={{"color": "darkslategrey", "backgroundColor": "white"}}
          />
        </div>
        <div className="submit-button-container">
          <Button text="Created" onPress={handleSubmit}/>
        </div>
      </div>
    </div>
  )
};
