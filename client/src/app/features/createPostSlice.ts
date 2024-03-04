import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { v4 as uuid } from 'uuid';

// Define a type for the slice state
interface Post {
  post: string;
  type: string;
  id:string;
}
interface PostState {
  isUploadPostModalOpen: boolean;
  isCreatePostModalOpen: boolean;
  isCropPostModalOpen: boolean;
  isAspectRatioModalOpen: boolean;
  isManagePostsModalOpen: boolean;
  isEditPostsModalOpen: boolean;
  isSharePostModalOpen: boolean;
  isFiltersTabOpen:boolean;
  isAdjustmentsTabOpen:boolean;
  isShareModalAdvancedSettingsOpen:boolean;
  isShareModalAccessibilitySettingsOpen:boolean;
  isSuccessModalOpen:boolean;
  loading: boolean;
  post: Post[];
  currentAspectRatio: string;
  isHideLikesAndViews:boolean;
  isCommentsOff:boolean;
}

// Define the initial state using that type
const initialState: PostState = {
  isUploadPostModalOpen: false,
  isCreatePostModalOpen: false,
  isCropPostModalOpen: false,
  isAspectRatioModalOpen: false,
  isManagePostsModalOpen: false,
  isEditPostsModalOpen: false,
  isFiltersTabOpen: false,
  isAdjustmentsTabOpen: false,
  isSharePostModalOpen:false,
  isShareModalAdvancedSettingsOpen:false,
  isShareModalAccessibilitySettingsOpen:false,
  isSuccessModalOpen:false,
  loading:false,
  isHideLikesAndViews:false,
  isCommentsOff:false,
  post: [],
  currentAspectRatio: "Original"
};

export const uploadFiles = createAsyncThunk(
  'createPost/uploadFiles',
  async (files: FileList) => {
    const uploadedPosts: Post[] = [];
    for (let i = 0; i < files.length; i++) {
      const type = files[i].type.split('/')[0];
      const id = uuid();
      const file = files[i];
      if (file) {
        const storageRef = ref(storage, `posts/${id}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedPosts.push({ type, post: downloadURL ,id});
      }
    }
    return uploadedPosts;
  }
);
export const deleteFile = createAsyncThunk(
  'createPost/deleteFile',
  async (id: string ) => {
    const storageRef = ref(storage, `posts/${id}`);
    await deleteObject(storageRef)
    
  }
);

export const createPostSlice = createSlice({
  name: 'createPost',
  initialState,
  reducers: {
    toggleUploadPostModal: (state) => {
      state.isUploadPostModalOpen = !state.isUploadPostModalOpen;
    },
    toggleCreatePostModalOpen: (state) => {
      state.isCreatePostModalOpen = !state.isCreatePostModalOpen;
    },
    toggleCropPostModalOpen: (state) => {
      state.isCropPostModalOpen = !state.isCropPostModalOpen;
    },
    toggleIsAspectRatioModalOpen: (state) => {
      state.isAspectRatioModalOpen = !state.isAspectRatioModalOpen;
    },
    toggleIsManagePostsModalOpen: (state) => {
      state.isManagePostsModalOpen = !state.isManagePostsModalOpen;
    },
    toggleIsEditPostsModalOpen: (state) => {
      state.isEditPostsModalOpen = !state.isEditPostsModalOpen;
    },
    toggleIsFiltersTabOpen: (state) => {
      state.isFiltersTabOpen = !state.isFiltersTabOpen;
    },
    toggleIsAdjustmentsTabOpen: (state) => {
      state.isAdjustmentsTabOpen = !state.isAdjustmentsTabOpen;
    },
    toggleIsSharePostModalOpen: (state) => {
      state.isSharePostModalOpen = !state.isSharePostModalOpen;
    },
    toggleIsShareModalAdvancedSettingsOpen: (state) => {
      state.isShareModalAdvancedSettingsOpen = !state.isShareModalAdvancedSettingsOpen;
    },
    toggleIsShareModalAccessibilitySettingsOpen: (state) => {
      state.isShareModalAccessibilitySettingsOpen = !state.isShareModalAccessibilitySettingsOpen;
    },
    toggleIsSuccessModalOpen: (state) => {
      state.isSuccessModalOpen = !state.isSuccessModalOpen;
    },

    setIsCommentsOff: (state, action) => {
      state.isCommentsOff =action.payload;
    },
    setIsHideLikesAndViews: (state, action) => {
      state.isHideLikesAndViews =action.payload;
    },
    setCreatePost: (state, action: PayloadAction<Post>) => {
      state.post = [...state.post, action.payload];
    },
    setCreatePosts:(state,action)=>{
      state.post=action.payload
    },
    setCurrentAspectRatio: (state, action: PayloadAction<string>) => {
      state.currentAspectRatio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFiles.fulfilled, (state, action) => {
      state.post = [...state.post, ...action.payload];
      state.loading=false;
    });
    builder.addCase(uploadFiles.pending, (state) => {
      state.loading =true;
    });
  },
});

export const { toggleUploadPostModal, toggleCreatePostModalOpen, toggleCropPostModalOpen, setCreatePost, toggleIsAspectRatioModalOpen, setCurrentAspectRatio, toggleIsManagePostsModalOpen ,setCreatePosts,toggleIsEditPostsModalOpen,toggleIsAdjustmentsTabOpen,toggleIsFiltersTabOpen,toggleIsSharePostModalOpen,toggleIsShareModalAdvancedSettingsOpen ,toggleIsShareModalAccessibilitySettingsOpen,toggleIsSuccessModalOpen,setIsCommentsOff,setIsHideLikesAndViews} = createPostSlice.actions;

export const selectIsUploadPostModalOpen = (state: RootState): boolean => state.createPost.isUploadPostModalOpen;
export const selectIsCreatePostModalOpen = (state: RootState): boolean => state.createPost.isCreatePostModalOpen;
export const selectIsCropPostModalOpen = (state: RootState): boolean => state.createPost.isCropPostModalOpen;
export const selectIsAspectRatioModalOpen = (state: RootState): boolean => state.createPost.isAspectRatioModalOpen;
export const selectIsManagePostsModalOpen = (state: RootState): boolean => state.createPost.isManagePostsModalOpen;
export const selectIsSharePostModalOpen=(state:RootState):boolean=>state.createPost.isSharePostModalOpen;
export const selectIsEditPostsModalOpen = (state: RootState): boolean => state.createPost.isEditPostsModalOpen;
export const selectIsShareModalAdvancedSettingsOpen = (state: RootState): boolean => state.createPost.isShareModalAdvancedSettingsOpen;
export const selectIsShareModalAccessibilitySettingsOpen = (state: RootState): boolean => state.createPost.isShareModalAccessibilitySettingsOpen;
export const selectIsFiltersTabOpen = (state: RootState): boolean => state.createPost.isFiltersTabOpen;
export const selectIsAdjustmentsTabOpen= (state: RootState): boolean => state.createPost.isAdjustmentsTabOpen;
export const selectIsSuccessModalOpen = (state: RootState): boolean => state.createPost.isSuccessModalOpen;
export const selectIsHideLikesAndViews = (state: RootState): boolean => state.createPost.isHideLikesAndViews;
export const selectIsCommentsOff= (state: RootState): boolean => state.createPost.isCommentsOff;
export const selectPosts = (state: RootState): Post[] => state.createPost.post;
export const selectCurrentAspectRatio = (state: RootState): string => state.createPost.currentAspectRatio;

export default createPostSlice.reducer;
