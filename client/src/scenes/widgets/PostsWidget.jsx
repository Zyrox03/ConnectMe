import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/authSlice.js";
import PostWidget from "./PostWidget.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import React from "react";
import { useParams } from "react-router-dom";
const PostsWidget = ({ userID }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.auth.posts);
  const pageType = useSelector((state) => state.auth.isProfile);
  //   const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_API}/posts`, {
      method: "GET",
      //   headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.error) {
      dispatch(setPosts({ posts: data }));
    }
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/posts/${userID}/posts`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    // {username : "justzyrox03@gmail.com"}
    const data = await response.json();

    if (!data.error) {
      dispatch(setPosts({ posts: data }));
    }
  };
  const getFriendsPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/posts/${userID}/friends-posts`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    // {username : "justzyrox03@gmail.com"}
    const data = await response.json();

    if (!data.error) {
      dispatch(setPosts({ posts: data }));
    }
  };
  const getSavedPosts = async () => {
    console.log(userID)
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/posts/${userID}/saved`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    // {username : "justzyrox03@gmail.com"}
    const data = await response.json();

    if (!data.error) {
      dispatch(setPosts({ posts: data }));
    }
  };

  const { postID } = useParams();

  const getPost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API}/posts/${postID}`,
      {
        method: "GET",
        //   headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { post } = await response.json();
    dispatch(setPosts({ posts: [post] }));
  };

  useEffect(() => {
    if (pageType === "profile") {
      getUserPosts();
    } else if (pageType === "friendsPosts") {
      getFriendsPosts();
    } else if (pageType === "postPage") {
      getPost();
    } else if (pageType === "savedPosts") {
      getSavedPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userID,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            createdAt,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userID}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              createdAt={createdAt}
              comments={comments}
            />
          )
        )
      ) : (
        <WidgetWrapper
          sx={{
            marginTop: "2em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {pageType === "friendsPosts"
            ? "Your friends have not posted anything yet"
            : "Be the First to Post in ConnectMe"}
        </WidgetWrapper>
      )}
    </>
  );
};

export default PostsWidget;
