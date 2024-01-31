import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  posts: [],
  isProfile: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.isProfile = action.payload;
    },

    logUser: (state, action) => {
      state.token = true;
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.mode = "light";
    },

    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setSavedPosts: (state, action) => {
      if (state.user) {
        state.user.savedPosts = action.payload.savedPosts;
      } else {
        console.error("user saved posts non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },

    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload._id) {
          return action.payload;
        } else {
          return post;
        }
      });

      state.posts = updatedPosts;
    },
  },
});

export const {
  logUser,
  logoutUser,
  setMode,
  setFriends,
  setSavedPosts,
  setPost,
  setPosts,
  setProfile,
} = authSlice.actions;

export default authSlice.reducer;
