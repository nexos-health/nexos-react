import React, {useState} from "react";
import {Button} from "./Button";

export const GroupActionsOptions = ({group, handleEdit, handleDelete}) => {

  return (
    <div className="move-to-group-modal">
      <div className="group-actions-modal-container">
        <text onClick={handleEdit}>Edit</text>
        <text onClick={handleDelete}>Delete</text>
      </div>
    </div>
  )
};
