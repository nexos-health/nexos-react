import React from "react";
import styled, {css} from 'styled-components/macro'


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
  font-size: 16px;
  font-weight: 500;
  padding: 2px;
  &:hover {
    color: #3b6ad3;
  }
`;

export const ButtonContainer = styled.div`
  padding-right: 10px;
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
  font-style: normal;
  font-size: 14px;
`;

export const BoldedText = styled(Text)`
  font-weight: 600;
`;

export const ParagraphText = styled(Text)`
  font-weight: 400;
`;

export const OverflowText = styled(ParagraphText)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SearchBarContainer = styled(FlexRow)`
  width: 100%;
  justify-content: left;
  padding: 0 0 25px 0;
`;

export const SearchInput = styled.input`
  border: 1px solid #DBE2E9;
  height: 2.38rem;
  width: 350px;
  border-radius: 3px;
  padding: 0 0.5rem;
  -webkit-appearance: none;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 0.9em;
  box-sizing: border-box;
`;
