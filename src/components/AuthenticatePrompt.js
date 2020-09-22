import React from "react";
import {Button} from "./Button";

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
          <Button
            text="Cancel"
            onPress={handleClose}
            style={{"color": "darkslategrey", "backgroundColor": "white"}}
          />
        </div>
        <div className="submit-button-container">
          <Button text="Login" onPress={login}/>
        </div>
      </div>
    </div>
  )
};
