import * as React from "react";
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  BookmarkAdd,
  Settings,
  Inbox,
  Explore,
  Home,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../../components/UserImage.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const NavigationWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  // const token = useSelector((state) => state.auth.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  //   SELECTION OF LISTS
  const { pathname } = useLocation();

  const [selectedPathName, setSelectedPathName] = useState(pathname);

  const handleListItemClick = (link) => {
    setSelectedPathName(link);
    navigate(link);
  };

  const navigationLinks = [
    { name: "Home", icon: <Home />, link: "/home" },
    { name: "Explore", icon: <Explore />, link: "/explore" },
    { name: "Inbox", icon: <Inbox />, link: "/inbox" },
    { name: "Saved", icon: <BookmarkAdd />, link: "/saved" },
    { name: "Settings", icon: <Settings />, link: "/settings" },
  ];

  // Here, 'HomeIcon', 'ExploreIcon', 'MessagesIcon', 'SavedIcon', and 'SettingsIcon'
  // represent the actual icon components that you want to use.

  return (
    <WidgetWrapper>
      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <List component="nav" aria-label="main mailbox folders" disablePadding>
          {navigationLinks.map(({ name, icon, link }, index) => (
            <ListItemButton onClick={(event) => handleListItemClick(link)}>
              <ListItemIcon
                sx={{
                  color: `${
                    selectedPathName === link ? palette.primary.main : ""
                  }`,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={name}
                sx={{
                  color: `${
                    selectedPathName === link ? palette.primary.main : ""
                  }`,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </WidgetWrapper>
  );
};

export default NavigationWidget;
