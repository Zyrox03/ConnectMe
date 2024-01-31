import React from "react";
import {
  BookmarkAddOutlined,
  BookmarkAdd,
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
import { setPost, setSavedPosts } from "../../state/authSlice.js";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';

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
  // const formattedString = description.replace(/(?:\r\n|\r|\n){2,}/g, '<br/>\n').replace(/\r\n|\r|\n/g, '<br/>');
  const sanitizedHTML = DOMPurify.sanitize(description);

  // const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const { savedPosts } = useSelector((state) => state.auth.user);

  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const patchLike = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: loggedInUserId }),
      }
    );

    const updatedPost = await response.json();
    dispatch(setPost(updatedPost));
  };

  const copyPostLink = () => {
    const postLink = `${window.location.origin}/posts/${postId}`;

    // Create a temporary input element to copy the link to the clipboard
    const tempInput = document.createElement("input");
    tempInput.value = postLink;
    document.body.appendChild(tempInput);

    // Select and copy the link
    tempInput.select();
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, provide user feedback (e.g., show a tooltip, alert, etc.)
    alert("Post link copied to clipboard!");
  };

  const savePost = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_API
      }/users/${loggedInUserId}/updateSaved/${postId}`,
      {
        method: "PATCH",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { updatedUser } = await response.json();

    dispatch(setSavedPosts({ savedPosts: updatedUser }));
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
      <Typography
        color={main}
        sx={{ mt: "1rem", height: "fit-content", whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}

      />
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
            maxHeight: "100vh",
            objectFit: "cover",
          }}
          src={picturePath.path}
        />
      )}
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

        <Box>
          <IconButton onClick={savePost}>
            {savedPosts?.includes(postId) ? (
              <BookmarkAdd sx={{ color: primary }} />
            ) : (
              <BookmarkAddOutlined />
            )}
          </IconButton>

          <IconButton onClick={copyPostLink}>
            <ShareOutlined />
          </IconButton>
        </Box>
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
    </WidgetWrapper>
  );
};

export default PostWidget;
