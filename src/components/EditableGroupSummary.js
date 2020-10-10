import React from 'react';
import styled, {css} from 'styled-components';
import {BoldedText, FlexColumn, FlexRow, IconButton, ParagraphText} from "./BaseStyledComponents";


export const EditableGroupSummary = ({
   selectedGroup, editGroupName, editGroupDescription, setEditGroupName, setEditGroupDescription,
   handleEditGroupSave, handleEditGroupCancel}) => {
  return (
    <SummaryContainer>
      <GroupSummary edit>
        <span onChange={(e) => setEditGroupName(e.target.value)}>
          <GroupTitle edit value={editGroupName}/>
        </span>
        <EditActions>
          <SaveButton onClick={() => handleEditGroupSave(selectedGroup)}>Save</SaveButton>
          <i className="fa fa-times group-edit-cancel" onClick={handleEditGroupCancel}/>
        </EditActions>
      </GroupSummary>
      <GroupDescription edit onChange={(e) => setEditGroupDescription(e.target.value)}>
        {editGroupDescription}
      </GroupDescription>
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

const GroupSummary = styled(FlexRow)`
  ${props => props.edit && css`
    padding-bottom: 5px;
  `}
`;

const GroupDescription = styled.textarea`
  font-size: 14px;
  ${props => props.edit && css`
    border-radius: 3px;
    border-color: darkslategrey;
  `}
`;

const GroupTitle = styled.input`
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

const EditActions = styled(FlexRow)`
  font-size: 1.0em;
  color: #005ce0;
`;

const SaveButton = styled(IconButton)`
  font-size: 0.9em;
`;