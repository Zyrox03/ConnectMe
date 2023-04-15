import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navBar/index.jsx";
import FriendListWidget from "../../scenes/widgets/FriendListWidget.jsx";
import MyPostWidget from "../../scenes/widgets/MyPostWidget.jsx";
import PostsWidget from "../../scenes/widgets/PostsWidget.jsx";
import UserWidget from "../../scenes/widgets/UserWidget.jsx";
import {setProfile} from '../../state/authSlice.js'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const { userID } = useParams();
//   const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const {picturePath : {path}} = useSelector((state) => state.auth.user);

  const isProfile = useSelector((state) => state.auth.isProfile);
  const getUser = async () => {
    // https://bloom-pickled-pleasure.glitch.me
    const response = await fetch(`https://woozy-kindhearted-brie.glitch.me/users/${userID}`, {
      method: "GET",
    //   headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
  dispatch( setProfile(true) ) 

    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userID} picturePath={user.picturePath.path} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userID} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={path} />
          <Box m="2rem 0" />
          <PostsWidget userID={userID} isProfile={isProfile} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;