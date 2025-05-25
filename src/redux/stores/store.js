import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import EncryptedStorage from 'react-native-encrypted-storage';
import rootReducer from '../reducers/rootReducer';


const encryptedStorage = {
  getItem: async (key) => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  setItem: async (key, value) => {
    await EncryptedStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    await EncryptedStorage.removeItem(key);
  }
};


const persistConfig = {
  key: 'root',
  storage: encryptedStorage,
  whitelist: ['auth', 'users', 'categories', 'products'],
  timeout: 0,
   migrate: (state) => {
    try {
      if (state.products && !Array.isArray(state.products.products)) {
        return Promise.resolve({
          ...state,
          products: { products: [] } // Reset to proper structure
        });
      }
      return Promise.resolve(state);
    } catch (err) {
      return Promise.resolve(undefined); // Reset state on error
    }
  }
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);