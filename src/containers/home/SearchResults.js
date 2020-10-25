import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import {useDispatch} from "react-redux";
import Modal from "react-modal";
import Select from 'react-select';

import './Home.css';
import {CurrentProfessionalContent} from "../../components/CurrentProfessionalContent";
import {ProfessionalListItem} from "../../components/ProfessionalListItem";
import {
  BoldedText,
  FlexColumn,
  FlexRow,
} from "../../components/BaseStyledComponents";
import {MoveToGroupSelector} from "../../components/MoveToGroupSelector";
import {addProfessionalsToGroup} from "../../redux/actions/professional";



const addToGroupCustomStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height                : '315px',
    width                 : '400px',
    transform             : 'translate(-50%, -50%)'
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

const SearchResults = ({ groupsOptions, filteredProfessionals, selectedProfessionals, setSelectedProfessionals, handleSelectedProfessional, showActions=true }) => {
  const dispatch = useDispatch();

  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAddToGroupSubmit = (group) => {
    dispatch(addProfessionalsToGroup(selectedProfessionals, group.value));
    setSelectedAction(null);
    setSelectedProfessionals(new Set())
  };

  return (
    <SearchResultsContainer>
      {filteredProfessionals.length > 0
        ? <ProfessionalResultsContainer>
          <FlexRow>
            <ProfessionalResultsListContainer>
              {showActions &&
                <ActionsContainer>
                  <SelectionsContainer>
                    <CheckboxContainer>
                      <i className={"fa fa-" + (selectedProfessionals.size > 0 ? "check-square" : "square-o")}
                         style={{"font-size": "larger"}}/>
                    </CheckboxContainer>
                    <SelectedText>
                      {selectedProfessionals ? selectedProfessionals.size : "0"}
                      {selectedProfessionals.size === 1 ? " Professional" : " Professionals"} Selected
                    </SelectedText>
                  </SelectionsContainer>
                  <GroupActions>
                    <Select
                      options={actionsOptions}
                      value={selectedAction}
                      onChange={setSelectedAction}
                      isSearchable={false}
                      isDisabled={!selectedProfessionals || selectedProfessionals.size === 0}
                      components={{IndicatorSeparator: () => null}}
                      styles={customStyles}
                      name="actions"
                      placeholder="Actions"
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </GroupActions>
                </ActionsContainer>
              }
              <ProfessionalList>
                {filteredProfessionals.map((professional) => {
                  return (
                    <ProfessionalListItem
                      currentProfessional={currentProfessional}
                      professional={professional}
                      professionals={filteredProfessionals}
                      setCurrentProfessional={setCurrentProfessional}
                      selectedProfessionals={selectedProfessionals}
                      handleSelectedProfessional={handleSelectedProfessional}
                    />
                  )
                })}
              </ProfessionalList>
            </ProfessionalResultsListContainer>
            <CurrentProfessionalContainer inactive={!currentProfessional}>
              {currentProfessional && filteredProfessionals.indexOf(currentProfessional) >= 0
                ? <CurrentProfessionalContent currentProfessional={currentProfessional}/>
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

const SelectionsContainer = styled(FlexRow)`
  justify-content: left;
`;

const CheckboxContainer = styled.div`
  align-self: center
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
