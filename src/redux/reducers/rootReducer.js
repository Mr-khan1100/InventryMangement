// src/redux/rootReducer.js
import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice';
import categoriesReducer from '../slices/categoriesSlice';
import productsReducer from '../slices/productsSlice';

export default combineReducers({
  auth: authReducer,
  users: usersReducer,
  categories: categoriesReducer,
  products: productsReducer,
});
