import React from "react";
import styled, {css} from 'styled-components/macro'
import {Link} from "react-router-dom";


export const GroupsTable = ({groupsOptions, groups}) => {
  return (
    <GroupListContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading>Name</TableHeading>
            <TableHeadingLong>Description</TableHeadingLong>
            <TableHeadingEnd>Members</TableHeadingEnd>
          </TableRow>
        </TableHead>
        <TableBody>
        {groupsOptions.map((group) => {
          return (
            <TableRow>
              <TableData><GroupLink to={`/groups/${group.value}`}>{group.label}</GroupLink></TableData>
              <TableData>{group.description}</TableData>
              <TableDataEnd>{groups[group.value].professionalsUids.length}</TableDataEnd>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
    </GroupListContainer>
  )
};


const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  color: #5E6C84;
  font-weight: 600;
  line-height: 1.42857143;
  padding-bottom: 4px;
  padding-top: 4px;
  border-bottom: 2px solid #DFE1E6;
`;

const TableRow = styled.tr`
  display: table-row;
`;

const TableHeading = styled.th`
  display: table-cell;
  font-family: "Lato", Helvetica, Arial, serif;
  font-size: 16px;
  font-weight: 600;
`;

const TableHeadingLong = styled(TableHeading)`
  width: 60%;
`;

const TableHeadingEnd = styled(TableHeading)`
  text-align: right;
  padding-right: 10px;
`;

const TableBody = styled.tbody`
  border-bottom: 2px solid #DFE1E6;
`;

const TableData = styled.td`
  font-size: 14px;
  font-weight: 400;
  font-family: "Lato", Helvetica, Arial, serif;
  padding: 5px 20px 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
`;

const TableDataEnd = styled(TableData)`
  text-align: right;
  padding-right: 15px;
`;

const GroupListContainer= styled.div`
  margin: 0 30px;
  padding: 0;
`;

const GroupLink = styled(Link)`
  color: #041433;
  &:hover {
    color: #041433;
  }
`;
