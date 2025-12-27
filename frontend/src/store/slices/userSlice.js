import { createSlice } from '@reduxjs/toolkit';

const getUserFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  if (token && id && name && role) {
    return {
      token,
      id,
      name,
      role,
      isAuthenticated: true,
    };
  }

  return {
    token: null,
    id: null,
    name: null,
    role: null,
    isAuthenticated: false,
  };
};

const initialState = getUserFromLocalStorage();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, id, name, role } = action.payload;
      
      state.token = token;
      state.id = id;
      state.name = name;
      state.role = role;
      state.isAuthenticated = true;

      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
      state.name = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
    },
    updateProfile: (state, action) => {
      const { name } = action.payload;
      
      if (name) {
        state.name = name;
        localStorage.setItem('name', name);
      }
    },
    
    syncWithLocalStorage: (state) => {
      const userData = getUserFromLocalStorage();
      return userData;
    },
  },
});

export const { login, logout, updateProfile, syncWithLocalStorage } = userSlice.actions;
export default userSlice.reducer;
