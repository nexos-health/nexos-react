import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import {useDispatch} from "react-redux";
import Modal from "react-modal";
import Select from 'react-select';
import {useAuth0} from "../../react-auth0-spa";


import './Home.css';
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";
import {
  BoldedText,
  FlexColumn,
  FlexRow,
} from "../../components/BaseStyledComponents";
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {
  addProfessionalsToGroup,
  editProfessionalNotes,
  favourProfessional,
  unfavourProfessional
} from "../../redux/actions/professional";
import { SignInPrompt } from "../../components/SignInPrompt";


const addToGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    height                : '315px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
  }
};

const signInPromptCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    height                : 'auto',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)',
    padding               : "10px 5px",
  }
};

const customStyles = {
  container: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    const width = "100%";

    return {...provided, width, opacity, transition };
  },
  indicatorsContainer: (provided, state) => ({
    ...provided,
    marginLeft: "-5px"
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#005ce0"
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#fff"
  }),
  menu: (provided, state) => ({
    ...provided,
    fontSize: "12px"
  }),
};

const actionsOptions = [
  {"value": "add-to-group", "label": "Add to group"},
  // {"value": "share", "name": "Share"},
];

const SearchResults = ({ groupsOptions, groups, favouritesToggle, setFavouritesToggle, filteredProfessionals,
                         selectedProfessionals, setSelectedProfessionals, handleSelectedProfessional,
                         showActions=false }) => {

  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const dispatch = useDispatch();
  const favouriteGroup = Object.entries(groups).filter(([uid, group]) => {
    return group.name === "Favourites"
  });

  let favouritesUid, favourites;
  if (favouriteGroup.length === 1) {
    [favouritesUid, favourites] = favouriteGroup[0]
  }

  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [notes, setNotes] = useState(null);
  const [editNotes, setEditNotes] = useState(null);

  const [selectedAction, setSelectedAction] = useState(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const handleAddToGroupSubmit = (group) => {
    dispatch(addProfessionalsToGroup(selectedProfessionals, group.value));
    setSelectedAction(null);
    setSelectedProfessionals(new Set())
  };

  const handleSaveNotes = () => {
    dispatch(editProfessionalNotes(currentProfessional.uid, notes));
    setEditNotes(false);
  };

  const handleFavourProfessional = (professionalUid) => {
    if (favourites.professionalsUids.indexOf(professionalUid) > 0) {
      dispatch(unfavourProfessional(professionalUid, favouritesUid))
    } else {
      dispatch(favourProfessional(professionalUid, favouritesUid))
    }
  };

  const handleCurrentProfessional = (professionals, professional) => {
    let currentProfessional = professionals.filter(item => item.uid === professional.uid)[0];
    setCurrentProfessional(currentProfessional);
    setNotes(currentProfessional.userNotes);
  };

  const filterFavourites = (professionals) => {
    let filteredFavourites = professionals;
    filteredFavourites = filteredFavourites.filter(professional => {
      return favourites.professionalsUids.indexOf(professional.uid) > 0
    });

    return filteredFavourites
  };

  let displayProfessionals = filteredProfessionals;
  if (favouritesToggle) {
    displayProfessionals = filterFavourites(filteredProfessionals)
  }

  return (
    <SearchResultsContainer>
      {filteredProfessionals.length > 0
        ? <ProfessionalResultsContainer>
          <FlexRow>
            <ProfessionalResultsListContainer>
              {/*{showActions &&*/}
                {/*<ActionsContainer>*/}
                  {/*<SelectionsContainer>*/}
                    {/*<CheckboxContainer>*/}
                      {/*<i className={"fa fa-" + (selectedProfessionals.size > 0 ? "check-square" : "square-o")}*/}
                         {/*style={{"font-size": "larger"}}/>*/}
                    {/*</CheckboxContainer>*/}
                    {/*<SelectedText>*/}
                      {/*{selectedProfessionals ? selectedProfessionals.size : "0"}*/}
                      {/*{selectedProfessionals.size === 1 ? " Professional" : " Professionals"} Selected*/}
                    {/*</SelectedText>*/}
                  {/*</SelectionsContainer>*/}
                  {/*<GroupActions>*/}
                    {/*<Select*/}
                      {/*options={actionsOptions}*/}
                      {/*value={selectedAction}*/}
                      {/*onChange={setSelectedAction}*/}
                      {/*isSearchable={false}*/}
                      {/*isDisabled={!selectedProfessionals || selectedProfessionals.size === 0}*/}
                      {/*components={{IndicatorSeparator: () => null}}*/}
                      {/*styles={customStyles}*/}
                      {/*name="actions"*/}
                      {/*placeholder="Actions"*/}
                      {/*className="basic-multi-select"*/}
                      {/*classNamePrefix="select"*/}
                    {/*/>*/}
                  {/*</GroupActions>*/}
                 {/*</ActionsContainer>*/}
               {/*}*/}
              {isAuthenticated && favourites &&
                <FavouritesToggleContainer>
                  <SelectionsContainer>
                    <ToggleContainer>
                      <Toggle
                        onClick={() => setFavouritesToggle(!favouritesToggle)}
                        on={favouritesToggle}
                        className={"fa fa-" + (favouritesToggle ? "toggle-on" : "toggle-off")}/>
                    </ToggleContainer>
                    <FavouritesText>Only Show Favourites</FavouritesText>
                  </SelectionsContainer>
                </FavouritesToggleContainer>
              }
              <ProfessionalList>
                {displayProfessionals.map((professional) => {
                  return (
                    <ProfessionalListItem
                      currentProfessional={currentProfessional}
                      professional={professional}
                      professionals={filteredProfessionals}
                      favourites={favourites}
                      setSignInModalOpen={setSignInModalOpen}
                      handleFavourProfessional={handleFavourProfessional}
                      handleCurrentProfessional={handleCurrentProfessional}
                      selectedProfessionals={selectedProfessionals}
                      handleSelectedProfessional={handleSelectedProfessional}
                    />
                  )
                })}
              </ProfessionalList>
            </ProfessionalResultsListContainer>
            <CurrentProfessionalContainer inactive={!currentProfessional}>
              {currentProfessional && (filteredProfessionals.filter(p => {return p.uid === currentProfessional.uid}).length === 1)
                ? <CurrentProfessionalContent
                  currentProfessional={currentProfessional}
                  notes={notes}
                  editNotes={editNotes}
                  setNotes={setNotes}
                  setEditNotes={setEditNotes}
                  setSignInModalOpen={setSignInModalOpen}
                  handleSaveNotes={handleSaveNotes}
                  />
                : <NoCurrentProfessionalContainer>
                  Select a professional to view their profile
                </NoCurrentProfessionalContainer>
              }
            </CurrentProfessionalContainer>
          </FlexRow>
        </ProfessionalResultsContainer>
        : <ProfessionalResultsContainer noResults>
          Your search criteria have returned 0 results
        </ProfessionalResultsContainer>
      }
      <Modal
        isOpen={selectedAction && selectedAction.value === "add-to-group"}
        onRequestClose={() => setSelectedAction(null)}
        style={addToGroupCustomStyles}
      >
        <MoveToGroupSelector
          groups={groupsOptions}
          handleSubmit={handleAddToGroupSubmit}
          handleClose={() => setSelectedAction(null)}
        />
      </Modal>
      <Modal
        isOpen={signInModalOpen}
        onRequestClose={() => setSignInModalOpen(false)}
        style={signInPromptCustomStyles}
      >
        <SignInPrompt
          message={"Sign in to keep track of your favourite professionals and take personal notes on them"}
          login={loginWithRedirect}
          handleClose={() => setSignInModalOpen(false)}
        />
      </Modal>
    </SearchResultsContainer>
  )
};

export default SearchResults;


const SearchResultsContainer = styled(FlexRow)`
  width: 100%;
  justify-content: center;
`;

const ProfessionalResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 650px;
  border-top: solid;
  border-top-color: #f5e8e8;
  border-width: thick;
  ${props => props.noResults && css`
    padding-top: 100px;
    font-size: 16px;
    font-weight: bold;
    color: #9c7676;
    width: 1100px;
  `};
`;

const ProfessionalResultsListContainer = styled.div`
  border-color: darkslategrey;
  border-right: inset;
  border-width: 0.15em
`;

const ActionsContainer = styled(FlexRow)`
  padding: 10px 20px 10px 40px;
  justify-content: space-between;
  border-bottom: 2px solid #d4bfbf;
`;

const FavouritesToggleContainer = styled(FlexRow)`
  padding: 10px 20px 10px 40px;
  justify-content: space-between;
  border-bottom: 2px solid #d4bfbf;
`;

const SelectionsContainer = styled(FlexRow)`
  justify-content: left;
`;

const CheckboxContainer = styled.div`
  align-self: center;
`;

const ToggleContainer = styled.div`
  align-self: center;
`;

const Toggle = styled.i`
  font-size: x-large;
  transition: 350ms;
  &:hover {
    cursor: pointer;
  }
  ${props => props.on && css`
    color: green;
  `}
`;

const FavouritesText = styled(BoldedText)`
  align-self: center;
  font-size: 16px;
  color: #766f6f;
  padding-left: 15px;
`;

const SelectedText = styled(BoldedText)`
  align-self: center;
  font-size: 16px;
  color: #766f6f;
  padding-left: 30px;
`;

const GroupActions = styled.div`
  width: 100px;
  align-self: flex-end;
`;

const ProfessionalList = styled.ul`
  width: 550px;
  text-align: left;
  overflow: scroll;
  box-sizing: content-box;
  height: 100%;
`;

const CurrentProfessionalContainer = styled(FlexColumn)`
  justify-content: flex-start;
  color: black;
  padding: 20px;
  width: 550px;
  ${props => props.inactive && css`
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 100px 0 0 0;
  `};
`;

export const NoCurrentProfessionalContainer = styled(FlexColumn)`
  justify-content: flex-start;
  color: black;
  border-color: darkslategrey;
  padding: 20px;
`;
