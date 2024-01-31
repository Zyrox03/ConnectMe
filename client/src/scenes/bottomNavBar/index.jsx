import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  LocationOn,
  BookmarkAdded,
  Settings,
  Inbox,
  Explore,
  Home,
  AccountCircle,
  Restore,
} from "@mui/icons-material";
import { Paper, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BottomNavigationBar() {
  //   SELECTION OF LISTS
  const { pathname } = useLocation();

  const navigate = useNavigate();




  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const navigationLinks = [
    { name: "Home", icon: <Home />, link: "/home" },
    { name: "Explore", icon: <Explore />, link: "/explore" },
    // { name: "Inbox", icon: <Inbox />, link: "/inbox" },
    { name: "Saved", icon: <BookmarkAdded />, link: "/saved" },
    // { name: "Settings", icon: <Settings />, link: "/settings" },
  ];

  const profileID = useSelector(state=> state.auth.user._id)

  return (
    !isNonMobileScreens && (
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
        <BottomNavigation
            showLabels
            value={pathname}
            onChange={(event, newValue) => {
              navigate(newValue);
            }}
          >
            {navigationLinks.map(({ name, icon, link }, index) => (
              <BottomNavigationAction
                key={index}
                label={name}
                icon={icon}
                value={link}

              />
              ))}
              <BottomNavigationAction
                label={'Profile'}
                icon={<AccountCircle/>}
                value={`/profile/${profileID}`}

              />
          </BottomNavigation>
        </Paper>
      </Box>
    )
  );
}
