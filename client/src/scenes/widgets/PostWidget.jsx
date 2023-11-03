import React from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/authSlice.js";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  createdAt,
  likes,
  comments,

}) => {
  const string = description
  const formattedString = string.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n");


  // const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const patchLike = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_API}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost(updatedPost));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postID={postId}
        isPost={true}
        createdAt={createdAt}
      />
      <Typography color={main} sx={{ mt: "1rem", height: 'fit-content', whiteSpace: 'pre-wrap' }}>
      {formattedString}
    </Typography>
        {
    picturePath && (
      <img
        width="100%"
        height="auto"
        alt="post"
        style={{ borderRadius: "0.75rem", marginTop: "0.75rem" , maxHeight: "100vh", objectFit: 'cover'}}
        src={picturePath.path}
      />
    )
  }
  <FlexBetween mt="0.25rem">
    <FlexBetween gap="1rem">
      <FlexBetween gap="0.3rem">
        <IconButton onClick={patchLike}>
          {isLiked ? (
            <FavoriteOutlined sx={{ color: primary }} />
          ) : (
            <FavoriteBorderOutlined />
          )}
        </IconButton>
        <Typography>{likeCount}</Typography>
      </FlexBetween>

      {/* <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween> */}
    </FlexBetween>

    <IconButton>
      <ShareOutlined />
    </IconButton>
  </FlexBetween>
  {/* {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )} */}
      </WidgetWrapper >
    );
  };

export default PostWidget;