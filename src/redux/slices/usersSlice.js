import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  entities: {},
  ids: []
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    registerUser: {
      reducer: (state, action) => {
        const user = action.payload;
        state.entities[user.id] = user;
        state.ids.push(user.id);
      },
      prepare: ({ username, email, phone, passwordHash, profilePicture }) => ({
        payload: {
          id: nanoid(),
          username,
          email,
          phone,
          passwordHash,
          profilePicture: profilePicture || null,
          createdAt: new Date().toISOString(),
          activities: [],
          categories: [],
          products: []
        }
      })
    },
    updateProfilePicture: (state, action) => {
      const { userId, imageUri } = action.payload;
      const user = state.entities[userId];
      if (user) {
        user.profilePicture = imageUri;
        user.activities.unshift({
          id: nanoid(),
          type: 'PROFILE_PICTURE_UPDATED',
          timestamp: new Date().toISOString(),
          details: 'Updated profile picture'
        });
      }
    },
    addUserActivity: (state, action) => {
      const { userId, activity } = action.payload;
      const user = state.entities[userId];
      if (user) {
        user.activities.unshift({
          id: nanoid(),
          timestamp: new Date().toISOString(),
          ...activity,
        });
      }
    },
    updateUserProfile: (state, action) => {
      const { userId, updates } = action.payload;
      const user = state.entities[userId];
      if (user) {
        const changes = Object.keys(updates)
          .filter(key => key !== 'passwordHash')
          .map(key => `${key} updated`);
        
        user.activities.unshift({
          id: nanoid(),
          type: 'PROFILE_UPDATED',
          timestamp: new Date().toISOString(),
          details: changes.join(', ') || 'Profile updated'
        });

        Object.assign(user, updates);
      }
    }
  }
});

export const { registerUser, updateProfilePicture, addUserActivity, updateUserProfile } = usersSlice.actions;
export default usersSlice.reducer;