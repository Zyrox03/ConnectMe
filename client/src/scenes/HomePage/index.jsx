import {  Box, useMediaQuery } from "@mui/material";
import React from "react";
import Navbar from "../navBar/index.jsx";
import UserWidget from "../../scenes/widgets/UserWidget.jsx";
import MyPostWidget from "../../scenes/widgets/MyPostWidget.jsx";
import PostsWidget from "../../scenes/widgets/PostsWidget.jsx";
import AdvertWidget from "../../scenes/widgets/AdvertWidget.jsx";
import FriendListWidget from "../../scenes/widgets/FriendListWidget.jsx";
import { Link } from "react-router-dom";
import { setProfile } from "../../state/authSlice.js";
import { useSelector, useDispatch } from "react-redux";
import NavigationWidget from "../widgets/NavigationWidget.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const {
    _id,
    picturePath: { path },
  } = useSelector((state) => state.auth.user);
  const isProfile = useSelector((state) => state.auth.isProfile);
  dispatch(setProfile('friendsPosts'));

  return (
    <Box >

      <Navbar />
    {/* {!isNonMobileScreens && ( */}
      {/* )} */}
      <Box
        sx={{
          paddingTop: `${!isNonMobileScreens ? "5em" : "7em"}`
        }}

        width="100%"
        padding="2rem 1rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        position="relative"
      >
        <Box
          display={isNonMobileScreens ? "flex" : "none"}
          flexBasis={isNonMobileScreens ? "26%" : undefined}
        >
          <Box
            position="fixed"
            width={isNonMobileScreens ? "26%" : "100%"}
            display="flex"
            flexDirection="column"
            overflow="scroll"
            gap="0.5rem"
            maxHeight='calc(95vh)'
            sx={{
              "&::-webkit-scrollbar": {
                width: "0", // Adjust as needed
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            <UserWidget userId={_id} picturePath={path} />
            <NavigationWidget userId={_id} picturePath={path} />
            <FriendListWidget userId={_id} />
          </Box>
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={path} />
          <PostsWidget userID={_id} />
        </Box>

        {isNonMobileScreens && (
          <Box position="relative" flexBasis="26%">


           <Box
            position="fixed"
            width={isNonMobileScreens ? "26%" : "100%"}
            display="flex"
            flexDirection="column"
            overflow="scroll"
            gap="0.5rem"
            maxHeight='calc(95vh)'
            sx={{
              "&::-webkit-scrollbar": {
                width: "0", // Adjust as needed
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
            >

{/* <FriendListWidget userId={_id} /> */}

              <Link
                to={"https://zyfitclub.pages.dev"}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <AdvertWidget />
              </Link>
              
            </Box>
          </Box>
        )}
      </Box>
    {/* <BottomNavBar/> */}

    </Box>
  );
};

export default HomePage;
