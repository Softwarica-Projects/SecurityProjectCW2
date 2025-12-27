export const selectUser = (state) => state.user;
export const selectUserToken = (state) => state.user.token;
export const selectUserId = (state) => state.user.id;
export const selectUserName = (state) => state.user.name;
export const selectUserRole = (state) => state.user.role;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsAdmin = (state) => state.user.role === 'admin';
export const selectIsUser = (state) => state.user.role === 'user';
