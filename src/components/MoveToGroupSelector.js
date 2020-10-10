import React, {useState} from "react";
import {Button} from "./Button";
import {BaseButton, ButtonContainer} from "./BaseStyledComponents";

export const MoveToGroupSelector = ({groups, handleSubmit, handleClose}) => {
  const [selectedGroup, setSelectedGroup] = useState(false);

  return (
    <div className="move-to-group-modal">
      <div className="move-to-group-container">
        <text>Group Name</text>
        <div className="group-list-selection">
          <ul className="move-to-group-list">
            {groups.map((group) => {
              return (
                <div
                  className={"group-list-item" + (selectedGroup && group.value === selectedGroup.value ? " selected" : "")}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div>
                    {group.label}
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="move-to-modal-actions">
        <ButtonContainer><BaseButton secondary onClick={handleClose}>Cancel</BaseButton></ButtonContainer>
        <ButtonContainer><BaseButton onClick={() => handleSubmit(selectedGroup)}>Move</BaseButton></ButtonContainer>
      </div>
    </div>
  )
};
