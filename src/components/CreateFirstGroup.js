import React from "react";
import styled from 'styled-components'
import {BaseButton} from "./BaseStyledComponents";


export const CreateFirstGroup = ({createGroup, loginWithRedirect, isAuthenticated}) => {
  return (
    <CreateGroupContainer>
      <CenteredTitleText>
        Start Creating Groups
      </CenteredTitleText>
      <CenteredText>
        Create groups to organise professionals into helpful categories such as “Diabetes Support” or “Favourites”,
        so you can quickly find them at a later stage
      </CenteredText>
      <PaddedButtonContainer>
        <BaseButton onClick={isAuthenticated ? createGroup : loginWithRedirect}>
          {isAuthenticated ? "Create Group" : "Sign In"}
        </BaseButton>
      </PaddedButtonContainer>
    </CreateGroupContainer>
  )
};


const PaddedButtonContainer = styled.div`
  padding: 5px;
`;

const CenteredText = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 450px;
  padding-bottom: 10px;
`;

const CenteredTitleText = styled.div`
  display: flex;
  align-items: center;
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 18px;
  padding: 5px 0 5px 0;
`;

const CreateGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
