import React from 'react';
import styled, {css} from 'styled-components/macro';
import {BoldedText, FlexColumn, FlexRow, IconButton, ParagraphText} from "./BaseStyledComponents";


export const EditableGroupSummary = ({
   selectedGroup, editGroupName, editGroupDescription, setEditGroupName, setEditGroupDescription,
   handleEditGroupSave, handleEditGroupCancel}) => {
  return (
    <SummaryContainer>
      <FlexRow>
        <span onChange={(e) => setEditGroupName(e.target.value)}>
          <GroupTitle edit value={editGroupName}/>
        </span>
        <EditActions>
          <SaveButton onClick={() => handleEditGroupSave(selectedGroup)}>Save</SaveButton>
          <i className="fa fa-times group-edit-cancel" onClick={handleEditGroupCancel}/>
        </EditActions>
      </FlexRow>
      <GroupEditDescription edit onChange={(e) => setEditGroupDescription(e.target.value)}>
        {editGroupDescription}
      </GroupEditDescription>
    </SummaryContainer>
  )
};


const SummaryContainer = styled(FlexColumn)`
  justify-content: flex-start;
  padding: 10px;
  height: 100px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
`;

const GroupEditDescription = styled.textarea`
  font-size: 14px;
  max-width: 700px;
  font-weight: 500;
  font-style: normal;
  border-radius: 3px;
  border-color: darkslategrey;
`;

export const GroupTitle = styled.input`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 20px;
  font-style: normal;
  border-radius: 3px;
  border-color: darkslategrey;
  border-width: 1px;
  width: 100%;
`;

export const EditActions = styled(FlexRow)`
  align-items: baseline;
  font-size: 1.0em;
  color: #005ce0;
`;

export const SaveButton = styled(IconButton)`
  font-size: 0.9em;
`;