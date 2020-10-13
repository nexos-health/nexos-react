import React, { useState } from "react";
import {Link, NavLink as RouterNavLink} from "react-router-dom";
import { FaBars } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { IconContext } from 'react-icons';
import styled, { css } from 'styled-components/macro';

import { useAuth0 } from "../react-auth0-spa";
import {clearAccessToken, getAccessToken} from "../utils/authentication";
import { SidebarData } from "./SidebarData";
import {BaseButton, FlexColumn, FlexRow} from "./BaseStyledComponents";
import {SIDEBAR_WIDTH, TOP_BAR_HEIGHT} from "../utils/constants"
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const NavBar = ({toggleSidebar, sidebar}) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () => {
    clearAccessToken();
    logout({
      returnTo: window.location.origin
    });
  };

  if (!isAuthenticated && getAccessToken()) {
    clearAccessToken();
  }

  return (
    <>
    <IconContext.Provider value={{color: '#fff'}}>
      <TopNavBar>
        {/*<MenuBarsLink to="#">*/}
          {/*<FaBars onClick={toggleSidebar}/>*/}
        {/*</MenuBarsLink>*/}
        <div>
          <Nav className="d-none d-md-block" navbar>
            {/*{!isAuthenticated && (*/}
              {/*<NavItem>*/}
                {/*<BaseButton onClick={() => loginWithRedirect({})}>Sign In</BaseButton>*/}
              {/*</NavItem>*/}
            {/*)}*/}
            {isAuthenticated && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret id="profileDropDown">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="35"
                  />
                </DropdownToggle>
                <DropdownMenu right style={{position: "absolute"}}>
                  <DropdownItem header>{user.name}</DropdownItem>
                  <DropdownItem
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
          {/*{!isAuthenticated && (*/}
            {/*<Nav className="d-md-none" navbar>*/}
              {/*<NavItem>*/}
                {/*<BaseButton onClick={() => loginWithRedirect({})}>Sign In</BaseButton>*/}
              {/*</NavItem>*/}
            {/*</Nav>*/}
          {/*)}*/}
          {isAuthenticated && (
            <Nav
              className="d-md-none justify-content-between"
              navbar
              style={{ minHeight: 170 }}
            >
              <NavItem>
                <span className="user-info">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile d-inline-block rounded-circle mr-3"
                    width="50"
                  />
                  <h6 className="d-inline-block">{user.name}</h6>
                </span>
              </NavItem>
              <NavItem>
                <FontAwesomeIcon icon="power-off" className="mr-3" />
                <RouterNavLink
                  to="#"
                  id="qsLogoutBtn"
                  onClick={() => logoutWithRedirect()}
                >
                  Log out
                </RouterNavLink>
              </NavItem>
            </Nav>
          )}
        </div>
      </TopNavBar>
      <NavMenu active={sidebar}>
        <NavMenuItems>
          {/*<NavToggle>*/}
            {/*<Link to="#">*/}
              {/*<AiOutlineClose onClick={toggleSidebar}/>*/}
            {/*</Link>*/}
          {/*</NavToggle>*/}
          {SidebarData.map((item, index) => {
            return (
              <NavText key={index}>
                <NavTextLink to={item.path}>
                  {item.icon}
                  <TitleSpan>{item.title}</TitleSpan>
                </NavTextLink>
              </NavText>
            )
          })}
        </NavMenuItems>
      </NavMenu>
    </IconContext.Provider>
    </>
  );


    {/*<div className="nav-container">*/}
      {/*<Navbar color="light" light expand="md">*/}
        {/*<Container>*/}
          {/*<NavbarBrand className="logo" />*/}
          {/*<NavbarToggler onClick={toggle} />*/}
          {/*<Collapse isOpen={isOpen} navbar>*/}
            {/*<Nav className="mr-auto" navbar>*/}
              {/*<NavItem>*/}
                {/*<NavLink*/}
                  {/*tag={RouterNavLink}*/}
                  {/*to="/"*/}
                  {/*exact*/}
                  {/*activeClassName="router-link-exact-active"*/}
                {/*>*/}
                  {/*Search*/}
                {/*</NavLink>*/}
              {/*</NavItem>*/}
            {/*</Nav>*/}
            {/*<Nav className="d-none d-md-block" navbar>*/}
              {/*{!isAuthenticated && (*/}
                {/*<NavItem>*/}
                  {/*<Button*/}
                    {/*id="qsLoginBtn"*/}
                    {/*color="primary"*/}
                    {/*className="btn-margin"*/}
                    {/*onClick={() => loginWithRedirect({})}*/}
                  {/*>*/}
                    {/*Sign In*/}
                  {/*</Button>*/}
                {/*</NavItem>*/}
              {/*)}*/}
              {/*{isAuthenticated && (*/}
                {/*<UncontrolledDropdown nav inNavbar>*/}
                  {/*<DropdownToggle nav caret id="profileDropDown">*/}
                    {/*<img*/}
                      {/*src={user.picture}*/}
                      {/*alt="Profile"*/}
                      {/*className="nav-user-profile rounded-circle"*/}
                      {/*width="50"*/}
                    {/*/>*/}
                  {/*</DropdownToggle>*/}
                  {/*<DropdownMenu>*/}
                    {/*<DropdownItem header>{user.name}</DropdownItem>*/}
                    {/*<DropdownItem*/}
                      {/*tag={RouterNavLink}*/}
                      {/*to="/profile"*/}
                      {/*className="dropdown-profile"*/}
                      {/*activeClassName="router-link-exact-active"*/}
                    {/*>*/}
                      {/*<FontAwesomeIcon icon="user" className="mr-3" /> Profile*/}
                    {/*</DropdownItem>*/}
                    {/*<DropdownItem*/}
                      {/*id="qsLogoutBtn"*/}
                      {/*onClick={() => logoutWithRedirect()}*/}
                    {/*>*/}
                      {/*<FontAwesomeIcon icon="power-off" className="mr-3" /> Log out*/}
                    {/*</DropdownItem>*/}
                  {/*</DropdownMenu>*/}
                {/*</UncontrolledDropdown>*/}
              {/*)}*/}
            {/*</Nav>*/}
            {/*{!isAuthenticated && (*/}
              {/*<Nav className="d-md-none" navbar>*/}
                {/*<NavItem>*/}
                  {/*<Button*/}
                    {/*id="qsLoginBtn"*/}
                    {/*color="primary"*/}
                    {/*block*/}
                    {/*onClick={() => loginWithRedirect({})}*/}
                  {/*>*/}
                    {/*Sign In*/}
                  {/*</Button>*/}
                {/*</NavItem>*/}
              {/*</Nav>*/}
            {/*)}*/}
            {/*{isAuthenticated && (*/}
              {/*<Nav*/}
                {/*className="d-md-none justify-content-between"*/}
                {/*navbar*/}
                {/*style={{ minHeight: 170 }}*/}
              {/*>*/}
                {/*<NavItem>*/}
                  {/*<span className="user-info">*/}
                    {/*<img*/}
                      {/*src={user.picture}*/}
                      {/*alt="Profile"*/}
                      {/*className="nav-user-profile d-inline-block rounded-circle mr-3"*/}
                      {/*width="50"*/}
                    {/*/>*/}
                    {/*<h6 className="d-inline-block">{user.name}</h6>*/}
                  {/*</span>*/}
                {/*</NavItem>*/}
                {/*<NavItem>*/}
                  {/*<FontAwesomeIcon icon="user" className="mr-3" />*/}
                  {/*<RouterNavLink*/}
                    {/*to="/profile"*/}
                    {/*activeClassName="router-link-exact-active"*/}
                  {/*>*/}
                    {/*Profile*/}
                  {/*</RouterNavLink>*/}
                {/*</NavItem>*/}
                {/*<NavItem>*/}
                  {/*<FontAwesomeIcon icon="power-off" className="mr-3" />*/}
                  {/*<RouterNavLink*/}
                    {/*to="#"*/}
                    {/*id="qsLogoutBtn"*/}
                    {/*onClick={() => logoutWithRedirect()}*/}
                  {/*>*/}
                    {/*Log out*/}
                  {/*</RouterNavLink>*/}
                {/*</NavItem>*/}
              {/*</Nav>*/}
            {/*)}*/}
          {/*</Collapse>*/}
        {/*</Container>*/}
      {/*</Navbar>*/}
    {/*</div>*/}
};

export default NavBar;

const TopNavBar = styled(FlexRow)`
  background-color: #fefefe;
  height: ${TOP_BAR_HEIGHT};
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  width: 100vw;
  padding-right: 20px;
  z-index: 2;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
`;

const MenuBarsLink = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  background: none;
`;

const NavMenu = styled.nav`
  background-color: #f8f9fa;
  width: ${SIDEBAR_WIDTH};
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: ${TOP_BAR_HEIGHT};
  left: -100%;
  transition: 850ms;
  z-index: 1;
  box-shadow: 2px 5px 3px 0 rgba(0,0,0,0.16);
  ${props => props.active && css`
    left: 0;
    transition: 350ms;
  `}
`;

const NavText = styled.li`
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 16px;
  list-style: none;
  height: 50px;
`;

const NavTextLink = styled(Link)`
  color: #394963;
  font-size: 16px;
  font-weight: 600;
  width: 95%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
  &:hover {
    background-color: #ebebeb;
    text-decoration: none;
  }
`;

const NavMenuItems = styled.ul`
  width: 100%;
  padding-inline-start: 0;
  padding-top: 25px;
`;

const NavToggle = styled.li`
  background-color: #060b26;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const TitleSpan = styled.span`
  margin-left: 16px;
`;
