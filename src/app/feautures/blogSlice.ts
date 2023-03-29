import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiConfigPublic } from "api";
import { BlogItem } from "types";
import { AxiosError } from "axios";
import { TabsNames } from "components";

interface ArticlesState {
  articles: BlogItem[];
  news: BlogItem[];
  isLoading: boolean;
  error: null | string;
  searchParams: SearchParams;
}

interface SearchParams {
  searchValue: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  news: [],
  isLoading: false,
  error: null,
  searchParams: {
    searchValue: null,
  },
};

export const fetchArticles = createAsyncThunk<
  BlogItem[],
  { page: number; value: string; word: string },
  { rejectValue: string }
>("articles/fetchArticles", async (params, { rejectWithValue }) => {
  try {
    return await apiConfigPublic.getAllBlogs(
      params.page,
      params.value,
      params.word,
      TabsNames.ARTICLE_VALUE
    );
  } catch (error) {
    const errorMessage = error as AxiosError;
    return rejectWithValue(errorMessage.message);
  }
});

export const fetchNews = createAsyncThunk<
  BlogItem[],
  { page: number; value: string; word: string },
  { rejectValue: string }
>("news/fetchNews", async (params, { rejectWithValue }) => {
  try {
    return await apiConfigPublic.getAllBlogs(
      params.page,
      params.value,
      params.word,
      TabsNames.NEWS_VALUE
    );
  } catch (error) {
    const errorMessage = error as AxiosError;
    return rejectWithValue(errorMessage.message);
  }
});

export const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setSearchValue: (state, { payload }) => {
      state.searchParams.searchValue = payload.searchValue;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchArticles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchArticles.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.articles = payload;
    });
    builder.addCase(fetchArticles.rejected, (state, { payload }) => {
      if (payload) {
        state.isLoading = false;
        state.error = payload;
      }
    });

    builder.addCase(fetchNews.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNews.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.news = payload;
    });
    builder.addCase(fetchNews.rejected, (state, { payload }) => {
      if (payload) {
        state.isLoading = false;
        state.error = payload;
      }
    });
  },
});

export default blogsSlice.reducer;
export const { setSearchValue } = blogsSlice.actions;
