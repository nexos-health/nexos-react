import React, {useState} from "react";
import {BaseButton, ButtonContainer, FlexColumn, FlexRow} from "./BaseStyledComponents";
import styled from "styled-components/dist/styled-components-macro.esm";

export const SignInPrompt = ({message, login, handleClose}) => {
  return (
    <FlexColumn>
      <MessageContainer>
        <text>{message}</text>
      </MessageContainer>
      <Actions>
        <ButtonContainer><BaseButton secondary onClick={handleClose}>Cancel</BaseButton></ButtonContainer>
        <ButtonContainer><BaseButton onClick={login}>Login</BaseButton></ButtonContainer>
      </Actions>
    </FlexColumn>
  )
};

const MessageContainer = styled(FlexColumn)`
  padding: 10px;
`;

const Actions = styled(FlexRow)`
  padding: 10px;
  justify-content: flex-end;
`;