import React from "react";
import {Button} from "./Button";
import {BaseButton} from "./BaseStyledComponents";

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
          <BaseButton secondary onClick={handleClose}>Cancel</BaseButton>
        </div>
        <div className="submit-button-container">
          <BaseButton onClick={handleSubmit}>Create</BaseButton>
        </div>
      </div>
    </div>
  )
};
