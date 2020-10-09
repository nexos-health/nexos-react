import React from "react";
import styled, {css} from 'styled-components';


export const GroupsTable = ({groupsOptions, handleSelectedGroup}) => {
  return (
    <GroupListContainer>
      <Table>
        <TableHead>
          <TableHeader>
            <TableHeading>Name</TableHeading>
            <TableHeadingLong>Description</TableHeadingLong>
            <TableHeadingEnd>Members</TableHeadingEnd>
          </TableHeader>
        </TableHead>
        <TableBody>
        {groupsOptions.map((group) => {
          return (
            <TableRow onClick={() => handleSelectedGroup(group)}>
              <TableData>{group.label}</TableData>
              <TableData>{group.description}</TableData>
              <TableDataEnd># Members</TableDataEnd>
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
  &:hover {
    cursor: pointer;
    background-color: lightgrey;
  }
`;

const TableHeader = styled.tr`
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
  padding-right: 10px;
`;

const GroupListContainer= styled.div`
  margin: 0 30px;
  padding: 0;
`;
