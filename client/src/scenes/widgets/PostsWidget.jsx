import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/authSlice.js";
import PostWidget from "./PostWidget.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import React from "react";
const PostsWidget = ({ userID }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.auth.posts);
  const isProfile = useSelector((state) => state.auth.isProfile);
  //   const token = useSelector((state) => state.token);

  
  const getPosts = async () => {
    const response = await fetch("https://woozy-kindhearted-brie.glitch.me/posts", {
      method: "GET",
      //   headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if(!data.error){
      dispatch(setPosts({ posts: data }));
    }

  };

  const getUserPosts = async () => {
    const response = await fetch(
      `https://woozy-kindhearted-brie.glitch.me/posts/${userID}/posts`,
      {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` },
      }
    );
    // {username : "justzyrox03@gmail.com"}
    const data = await response.json();
    
    if(!data.error){
      dispatch(setPosts({ posts: data }));
    }
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
{posts ? posts.map(
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
      :
      <WidgetWrapper>
        Be the first to post in ConnectMe
      </WidgetWrapper>
      }

    </>
  );
};

export default PostsWidget;