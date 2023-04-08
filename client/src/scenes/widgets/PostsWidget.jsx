import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/authSlice.js";
import PostWidget from "./PostWidget.jsx";
import React from "react";
const PostsWidget = ({ userID }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.auth.posts);
  const isProfile = useSelector((state) => state.auth.isProfile);
  //   const token = useSelector((state) => state.token);

  
  const getPosts = async () => {
    const response = await fetch("https://connectme-upsk.onrender.com/posts", {
      method: "GET",
      //   headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `https://connectme-upsk.onrender.com/posts/${userID}/posts`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts && posts.map(
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
            comments={comments}
          />
        )
      )
      }
    </>
  );
};

export default PostsWidget;