import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  entities: [] // Now an array of category objects
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: {
      reducer(state, action) {
        state.entities.push(action.payload);
      },
      prepare(payload) {
        return {
          payload: {
            id: nanoid(),
            ...payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }
    },
    updateCategory(state, action) {
      const { id, ...updates } = action.payload;
      const index = state.entities.findIndex(cat => cat.id === id);
      if (index !== -1) {
        state.entities[index] = { 
          ...state.entities[index], 
          ...updates,
           image: updates.image || state.entities[index].image,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteCategory(state, action) {
      const id = action.payload;
      state.entities = state.entities.filter(cat => cat.id !== id);
    }
  }
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;