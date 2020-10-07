import React from "react";
import styled, {css} from 'styled-components';


export const GroupsTable = ({groupsOptions, handleSelectedGroup}) => {
  // return (
  //   <GroupListContainer>
  //     <GroupListHeadings>
  //       <GroupItemText heading>Name</GroupItemText>
  //       <GroupItemDescription heading>Description</GroupItemDescription>
  //       <GroupEndItemText heading>Members</GroupEndItemText>
  //     </GroupListHeadings>
  //     {groupsOptions.map((group) => {
  //       return (
  //         <ListItem onClick={() => handleSelectedGroup(group)}>
  //           <GroupItemText>{group.label}</GroupItemText>
  //           <GroupItemDescription>{group.description}</GroupItemDescription>
  //           <GroupEndItemText># Members</GroupEndItemText>
  //         </ListItem>
  //       )
  //     })}
  //   </GroupListContainer>
  // )
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


const GroupListHeadings = styled.li`
  display: flex;
  flex-direction: row;
  padding: 5px;
  border-bottom-color: #e6d2d2;
  border-bottom-width: thin;
  border-bottom-style: solid;
`;

export const ListItem = styled(GroupListHeadings)`
  border: none;
  &:hover {
    cursor: pointer;
    background-color: lightgrey;
  }
`;

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

export const GroupItemText = styled.div`
  font-family: "Lato", Helvetica, Arial, serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  padding: 5px 0 5px 0;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GroupEndItemText = styled(GroupItemText)`
    text-align: right;
    padding-right: 10px;
`;

const GroupItemDescription = styled(GroupItemText)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 3;
`;

const GroupListContainer= styled.div`
  margin: 0 30px;
  padding: 0;
`;
