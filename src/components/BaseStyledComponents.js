import React from "react";
import styled, {css} from 'styled-components';


export const BaseButton = styled.button`
  background-color: #415cb7;
  color: white;
  border: 1px solid #DBE2E9;
  font-size: 0.9em;
  font-weight: 700;
  border-radius: 3px;
  padding: 6px 12px;
  ${props => props.secondary && css`
    background-color: white;
    color: #000104;
  `}
`;

export const IconButton = styled.button`
  color: #5f5f5f;
  background-color: transparent;
  border: none;
  font-size: 12px;
  font-weight: 500;
  padding: 2px;
  &:hover {
    color: #3b6ad3;
  }
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Lato", Helvetica, Arial, serif;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Lato", Helvetica, Arial, serif;
`;

export const Text = styled.div`
  display: flex;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 600;
  font-style: normal;
  font-size: 14px;
`;

