import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const AuthApi = {
  async login(credentials) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`api/v1/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async register(userData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`api/v1/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await TokenManager.refreshAccessToken();
      return response;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }
};

export default AuthApi;