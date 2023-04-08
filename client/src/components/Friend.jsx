import React from "react";
import { PersonAddOutlined, PersonRemoveOutlined, Delete } from "@mui/icons-material"; 
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setPosts } from "../state/authSlice";
import FlexBetween from "../components/FlexBetween.jsx";
import UserImage from "../components/UserImage.jsx";
const Friend = ({ friendId, name, subtitle, userPicturePath, postID }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.auth.user);
  //   const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const isProfile = useSelector((state) => state.auth.isProfile);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  const patchFriend = async () => {
    // if (friendId === _id) return false
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const deletePost = async ()=> {
    
    const response = await fetch(
      `http://localhost:3001/posts/${postID}`,
      {
        method: "DELETE",
        
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }))
    navigate(`/home`)

  }


  
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {(friendId !== _id && !isProfile ) ? (
        <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
      ) : (
        <IconButton
        onClick={deletePost}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
          <Delete sx={{ color: primaryDark }} />
      </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;