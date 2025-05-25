import { createSlice, nanoid } from '@reduxjs/toolkit';

// Proper initial state with empty array
const initialState = {
  products: [] // Initialize with empty array
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: {
      reducer(state, action) {
        // Create complete product object with defaults
         if (!state.products) state.products = [];
        if (!Array.isArray(state.products)) state.products = [];
        const newProduct = {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: 'Untitled Product',
          description: '',
          price: 0,
          quantity: 0,
          lowStockThreshold: 5,
          images: [],
          categoryId: '',
          createdBy: '',
          ...action.payload
        };
        
        // Safely push to initialized array
        state.products.push(newProduct);
      },
      prepare(payload) {
        return { payload: payload || {} };
      }
    },
    updateProduct(state, action) {
      const { id, ...updates } = action.payload;
      const index = state.products.findIndex(p => p.id === id);
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteProduct(state, action) {
      state.products = state.products.filter(p => p.id !== action.payload);
    }
  }
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;