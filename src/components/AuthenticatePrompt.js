import React from "react";
import {Button} from "./Button";
import {BaseButton, ButtonContainer} from "./BaseStyledComponents";

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
        <ButtonContainer><BaseButton secondary onClick={handleClose}>Cancel</BaseButton></ButtonContainer>
        <ButtonContainer><BaseButton onClick={login}>Login</BaseButton></ButtonContainer>
      </div>
    </div>
  )
};
