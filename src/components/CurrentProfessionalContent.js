import React, {useState} from "react";
import styled, { css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Editor } from "@tinymce/tinymce-react";



import {BaseButton, BoldedText, FlexColumn, FlexRow, ParagraphText, TextArea} from "./BaseStyledComponents";
import {useAuth0} from "../react-auth0-spa";


export const CurrentProfessionalContent = ({currentProfessional, notes, editNotes, setNotes, setEditNotes,
                                             setSignInModalOpen, handleSaveNotes}) => {

  const { isAuthenticated } = useAuth0();

  const [expandedNotes, setExpandedNotes] = useState(false);

  const handleCancelNotes = () => {
    setEditNotes(false);
    setNotes(currentProfessional.userNotes);
  };

  return (
    <FlexColumn>
      <FlexColumn>
        <FlexRow>
          <NotesText>Personal Notes</NotesText>
          <EditIcon
            icon={["far", "edit"]}
            onClick={isAuthenticated ? () => setEditNotes(true) : () => setSignInModalOpen(true)}
            hidden={editNotes}
          />
        </FlexRow>
        {editNotes
          ? <FlexColumn>
            {/*<Editor*/}
              {/*value={notes}*/}
              {/*apiKey={process.env.REACT_APP_TINYMCE_API_KEY}*/}
              {/*init={{*/}
                {/*height: 500,*/}
                {/*menubar: false,*/}
                {/*plugins: [*/}
                  {/*"advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code " +*/}
                  {/*"fullscreen insertdatetime media table paste code help wordcount"*/}
                {/*],*/}
                {/*toolbar:"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright " +*/}
                  {/*"alignjustify | bullist numlist outdent indent | removeformat | help"*/}
              {/*}}*/}
              {/*onEditorChange={setNotes}*/}
            {/*/>*/}
            <NotesTextArea onChange={(e) => setNotes(e.target.value)}>
              {notes}
            </NotesTextArea>
            <ButtonContainers>
              <BaseButton secondary onClick={handleCancelNotes}>Cancel</BaseButton>
              <BaseButton onClick={handleSaveNotes}>Save</BaseButton>
            </ButtonContainers>
          </FlexColumn>
          : <DisplayedNotes expanded={expandedNotes} empty={!notes || notes.length === 0}>
            {notes || "Create personal notes for this professional"}
          </DisplayedNotes>
        }
        <ExpandIcon
          icon={["fas", "angle-down"]}
          onClick={() => setExpandedNotes(!expandedNotes)}
          expanded={expandedNotes}/>
        <Separator/>
      </FlexColumn>
      <FlexColumn>
        <span className="current-professional-name">
          {currentProfessional.firstName} {currentProfessional.lastName}
        </span>
        <CurrentProfessionalDescription>
          {currentProfessional.description}
        </CurrentProfessionalDescription>
        <span className="current-professional-extras">
          <b>Wait Time:</b> {currentProfessional.waitTimes}
        </span>
        <span className="current-professional-extras">
          <b>Fees:</b> {currentProfessional.fees}
        </span>
        <span className="current-professional-extras">
          <b>Bulk Billing:</b> {currentProfessional.bulkBilling}
        </span>
        <ClinicsContainer>
          <span><b>Clinics</b></span>
          {currentProfessional.clinics.map((clinic) => {
            return (
              <ClinicContainer>
                <span>{clinic.clinicName}</span>
                <span>Phone: {clinic.phone}</span>
                <span>Fax: {clinic.fax}</span>
                <span>Website: <a href={clinic.website} target="_blank" rel="noopener noreferrer">{clinic.website}</a></span>
                <span>
                  Address: {clinic.streetNumber} {clinic.streetName} {clinic.suburb}, {clinic.state}, {clinic.postcode}
                  </span>
              </ClinicContainer>
            )
          })}
        </ClinicsContainer>
      </FlexColumn>
    </FlexColumn>
  )
};


const CurrentProfessionalDescription = styled(ParagraphText)`
  color: darkgray;
  padding: 0 0 10px 0;
`;

const NotesText = styled(BoldedText)`
  align-self: center;
  padding-right: 5px;
  font-size: 16px;
  color: #766f6f;
`;

const EditIcon = styled(FontAwesomeIcon)`
  align-self: center;
  &:hover {
    cursor: pointer
  }
`;

const ExpandIcon = styled(FontAwesomeIcon)`
  align-self: center;
  &:hover {
    cursor: pointer
  }
  ${props => props.expanded && css`
    transform: rotate(180deg);
    transition: 500ms;
  `}
`;

const NotesTextArea = styled(TextArea)`
  min-height: 150px;
  overflow: scroll;
`;

const DisplayedNotes = styled(ParagraphText)`
  height: 50px;
  overflow: scroll;
  transition: height 500ms;
  ${props => props.expanded && css`
    height: 150px;
  `}
  ${props => props.empty && css`
    color: darkgrey;
  `}
`;

const Separator = styled.hr`
  border: 1px solid darkgrey;
  border-radius: 5px;
  width: 100%;
  margin: 5px 0;
`;

const ButtonContainers = styled(FlexRow)`
  padding-left: 10px;
  padding-top: 10px;
  justify-content: flex-end;
`;

const ClinicContainer = styled(FlexColumn)`
  justify-content: space-around;
  padding-top: 20px;
  font-size: small;
`;

const ClinicsContainer = styled.div`
  padding: 25px 0 10px 0;
`;

