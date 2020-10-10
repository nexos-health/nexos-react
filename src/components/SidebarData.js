import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: "Search",
    path: "/",
    icon: <AiIcons.AiOutlineSearch/>,
  },
  {
    title: "My Groups",
    path: "/groups",
    icon: <IoIcons.IoMdPeople/>,
  },
];