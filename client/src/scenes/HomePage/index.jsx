import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import Navbar from "../navBar/index.jsx";
import UserWidget from "../../scenes/widgets/UserWidget.jsx";
import MyPostWidget from "../../scenes/widgets/MyPostWidget.jsx";
import PostsWidget from "../../scenes/widgets/PostsWidget.jsx";
import AdvertWidget from '../../scenes/widgets/AdvertWidget.jsx'
import FriendListWidget from '../../scenes/widgets/FriendListWidget.jsx'
import { Link } from "react-router-dom";
import {setProfile} from '../../state/authSlice.js'
import { useSelector, useDispatch } from "react-redux";

const HomePage = () => {

    const dispatch = useDispatch()
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath: { path } } = useSelector((state) => state.auth.user);
    const isProfile = useSelector((state) => state.auth.isProfile);
    dispatch(setProfile(false))


    return (
        <Box>
            <Navbar />

            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block" }
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={path} />
                </Box>

                <Box 
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget picturePath={path} />
                    <PostsWidget userId={_id} />
                </Box>

                {isNonMobileScreens && (
          <Box flexBasis="26%">
            <Link to={'https://zyfitclub.pages.dev'} target="_blank" style={{ textDecoration: 'none' }}><AdvertWidget /></Link>
            
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
            </Box>
        </Box>
    )
}


export default HomePage