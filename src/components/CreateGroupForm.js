import React from "react";
import {BaseButton, ButtonContainer, FlexColumn, FlexRow} from "./BaseStyledComponents";
import styled from "styled-components";

export const CreateGroupForm = ({groupName, groupDescription, setGroupName, setGroupDescription, handleSubmit, handleClose}) => {
  return (
    <FlexColumn>
      <GroupNameContainer>
        <text>Name</text>
        <span onChange={(e) => setGroupName(e.target.value)}>
          <NameInput/>
        </span>
      </GroupNameContainer>
      <FlexColumn>
        <text>Description</text>
        <div>
          <DescriptionInput onChange={(e) => setGroupDescription(e.target.value)}>{groupDescription}</DescriptionInput>
        </div>
      </FlexColumn>
      <ModalActions>
        <ButtonContainer>
          <BaseButton secondary onClick={handleClose}>Cancel</BaseButton>
        </ButtonContainer>
        <ButtonContainer>
          <BaseButton onClick={handleSubmit}>Save</BaseButton>
        </ButtonContainer>
      </ModalActions>
    </FlexColumn>
  )
};

const GroupNameContainer = styled(FlexColumn)`
  justify-content: space-between;
  padding: 0 0 20px 0;
`;

const DescriptionInput = styled.textarea`
  background-color: #FFF;
  width: 100%;
  height: 100px;
  border: 1px solid #DBE2E9;
  border-radius: 3px;
  color: #53565A;
  padding: 0.7em;
  box-sizing: border-box;
  font-size: 0.79rem;
  transition: border-color 0.3s ease;
`;

const NameInput = styled.input`
  border: 1px solid #DBE2E9;
  height: 2.38rem;
  width: 200px;
  border-radius: 3px;
  padding: 0 0.5rem;
  -webkit-appearance: none;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 0.9em;
  box-sizing: border-box;
`;

const ModalActions = styled(FlexRow)`
  justify-content: flex-end;
  padding: 27px 0 0 0;
`;
