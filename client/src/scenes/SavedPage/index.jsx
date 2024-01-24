import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navBar/index.jsx";
import FriendListWidget from "../../scenes/widgets/FriendListWidget.jsx";
import MyPostWidget from "../../scenes/widgets/MyPostWidget.jsx";
import PostsWidget from "../../scenes/widgets/PostsWidget.jsx";
import UserWidget from "../../scenes/widgets/UserWidget.jsx";
import { setProfile } from "../../state/authSlice.js";

const SavedPage = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const userID = useSelector(state=>state.auth.user._id)
  //   const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  dispatch(setProfile('savedPosts'));

  const {
    picturePath: { path },
  } = useSelector((state) => state.auth.user);

  const getUser = async () => {
    // https://bloom-pickled-pleasure.glitch.me
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/users/${userID}`,
      {
        method: "GET",
        //   headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUser(data);
  };

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
        sx={{
          paddingTop: `${!isNonMobileScreens ? "5em" : "7em"}`,
        }}
      >
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box m="2rem 0" />
          <PostsWidget userID={userID}  />
        </Box>
      </Box>
    </Box>
  );
};

export default SavedPage;
