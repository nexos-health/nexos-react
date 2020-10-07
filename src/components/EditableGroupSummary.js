import React from 'react';
import styled from 'styled-components';


export const EditableGroupSummary = ({
   selectedGroup, editGroupName, editGroupDescription, setEditGroupName, setEditGroupDescription,
   handleEditGroupSave, handleEditGroupCancel}) => {
  return (
    <div className="group-summary-content">
      <div className="group-summary-top edit">
        <span onChange={(e) => setEditGroupName(e.target.value)}>
          <input
            id="search-input"
            className="group-summary-title edit"
            value={editGroupName}
          />
        </span>
        <div className="group-edit-actions">
          <div className="group-edit-save" onClick={() => handleEditGroupSave(selectedGroup)}>Save</div>
          <i className="fa fa-times group-edit-cancel" onClick={handleEditGroupCancel}/>
        </div>
      </div>
      <textarea
        className="group-summary-description edit"
        value={editGroupDescription}
        onChange={(e) => setEditGroupDescription(e.target.value)}
      />
    </div>
  )
};