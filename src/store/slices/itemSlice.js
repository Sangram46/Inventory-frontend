import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchStats = createAsyncThunk(
  'items/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/items/stats');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/items', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const createItem = createAsyncThunk(
  'items/create',
  async (itemData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/items', itemData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, ...itemData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/items/${id}`, itemData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    stats: { totalItems: 0, totalValue: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearItemError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createItem.fulfilled, (state) => {
        // Will refetch the list to keep pagination consistent
      })
      .addCase(createItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const idx = state.list.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i._id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearItemError } = itemSlice.actions;
export default itemSlice.reducer;
