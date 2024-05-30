import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

// Define a type for the slice state
interface PostState {
  isPostModalOpen: boolean;
  post: any;
  toReplyComment: {
    commentId: string;
    username: string;
  };
}

// Define the initial state using that type
const initialState: PostState = {
  isPostModalOpen: false,
  post: {},
  toReplyComment: {
    commentId: "",
    username: "",
  },
};
export const getPostByIdWhenLoggedIn = createAsyncThunk(
  "post/get-post-by-id-logged-in",
  async (postId: string) => {
    try {
      const response = await axios.get(`/posts/get-private-post/${postId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPostByIdWhenNotLoggedIn = createAsyncThunk(
  "post/get-post-by-id-logged-in",
  async (postId: string) => {
    try {
      const response = await axios.get(`/posts/get-post/${postId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPostCommentsWhenLoggedIn = createAsyncThunk(
  "post/get-comments-when-logged-in",
  async ({ postId, page }: { postId: string; page: number }) => {
    try {
      const response = await axios.get(
        `/comments/get-private-post-comments/${postId}?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPostCommentsWhenNotLoggedIn = createAsyncThunk(
  "post/get-comments-when-not-logged-in",
  async ({ postId, page }: { postId: string; page: number }) => {
    try {
      const response = await axios.get(
        `/comments/get-public-post-comments/${postId}?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCommentReplies = createAsyncThunk(
  "post/get-comment-replies",
  async ({ commentId, page }: { commentId: string; page: number }) => {
    try {
      const response = await axios.get(
        `/comments/get-replies/${commentId}?page=${page}&limit=3`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postComment = createAsyncThunk(
  "comment/post",
  async ({
    postId,
    text,
    toReplyCommentId,
  }: {
    postId: string;
    text: string;
    toReplyCommentId?: string;
  }) => {
    try {
      if (toReplyCommentId) {
        const response = await axios.post(`/comments/post-comment/${postId}`, {
          text,
          toReplyCommentId,
        });
        return response.data;
      } else {
        const response = await axios.post(`/comments/post-comment/${postId}`, {
          text,
        });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllReels = createAsyncThunk(
  "post/get-all-reels",
  async (page: number) => {
    try {
      const response = await axios.get(
        `/posts/get-all-reels?limit=4&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPublicPosts = createAsyncThunk(
  "explore/get-all-posts",
  async ({ limit, page }: { limit: number; page: number }) => {
    try {
      const response = await axios.get(
        `/posts/get-all-public-posts?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllLikes = createAsyncThunk(
  "likes/get-all-likes",
  async ({
    targetId,
    targetType,
    page,
  }: {
    targetId: string;
    targetType: string;
    page?: number;
  }) => {
    try {
      if (!page) {
        page = 1;
      }
      const response = await axios.post(
        `/likes/get-all-likes?page=${page}&limit=7`,
        { targetId, targetType }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const actionOnPost = createAsyncThunk(
  "post/action",
  async ({
    targetType,
    targetId,
    action,
  }: {
    targetType: string;
    targetId: string;
    action: string;
  }) => {
    try {
      const response = await axios.post("/likes/item", {
        targetType,
        targetId,
        action,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    openPostModal: (state) => {
      state.isPostModalOpen = true;
    },
    closePostModal: (state) => {
      state.isPostModalOpen = false;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setToReplyComment: (state, action) => {
      state.toReplyComment = action.payload;
    },
  },
});

export const { openPostModal, closePostModal, setPost, setToReplyComment } =
  postSlice.actions;

export const selectIsPostModalOpen = (state: RootState): boolean =>
  state.post.isPostModalOpen;
export const selectPost = (state: RootState): any => state.post.post;
export const selectToReplyComment = (
  state: RootState
): { commentId: string; username: string } => state.post.toReplyComment;

export default postSlice.reducer;
