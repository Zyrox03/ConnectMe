import React from "react";
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import UserImage from "../../components/UserImage.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  // const token = useSelector((state) => state.auth.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/users/${userId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    setUser(data);
  };
  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const userInfo = {
    username: user?.identifier || `${firstName + lastName}`, // to fix and put real identifier tag
    friends: user.totalFriends,
    posts: user.totalPosts,
    totalLikes: user.totalLikes,
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="0.5rem" onClick={() => navigate(`/profile/${userId}`)}>
        <Box
          display="flex"
          width="100%"
          textAlign="center"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          gap="1rem"
        >
          <UserImage image={picturePath} size="90px" />
          <Box width="100%">
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.main,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography variant="subtitle1">@{userInfo.username}</Typography>

            <Box width="100%" mt="1.5rem">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h6">{userInfo.friends}</Typography>
                  <Typography variant="body2">Friends</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">{userInfo.posts}</Typography>
                  <Typography variant="body2">Posts</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">{userInfo.totalLikes}</Typography>
                  <Typography variant="body2">Total Likes</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserWidget;
