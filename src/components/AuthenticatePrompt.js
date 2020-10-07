import React from "react";
import {Button} from "./Button";
import {BaseButton} from "./BaseStyledComponents";

export const AuthenticatePrompt = ({handleClose, login}) => {
  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>
          Please login to access "Groups". These allow you to better organise professionals by creating custom groups
          such as "Favourites" or "ADHD Psychologists".
        </text>
      </div>
      <div className="move-to-modal-actions">
        <div className="cancel-button-container">
          <BaseButton secondary onClick={handleClose}>Cancel</BaseButton>
        </div>
        <div className="submit-button-container">
          <BaseButton onClick={login}>Login</BaseButton>
        </div>
      </div>
    </div>
  )
};
