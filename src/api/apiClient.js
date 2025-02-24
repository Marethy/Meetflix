import axios from "axios";
import qs from "qs";

const BASE_URL = "http://localhost:9091";
const TOKEN_URL = `${BASE_URL}/api/oauth2/v1/token`;
const REFRESH_TOKEN_URL = `${BASE_URL}/api/oauth2/v1/token`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const configureAxios = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const TokenManager = {
  async getAccessToken(credentials) {
    try {
      const { username, password } = credentials || {
        username: localStorage.getItem('username'), 
        password: localStorage.getItem('password'),
      };

      const response = await axios.post(
        TOKEN_URL,
        qs.stringify({
          grant_type: "password",
          client_id: "client",
          client_secret: "secret",
          username: username,
          password: password,
          scope: "client-internal",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      configureAxios();
      return access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  },

  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available.");
      }

      const response = await axios.post(
        REFRESH_TOKEN_URL,
        qs.stringify({
          grant_type: "refresh_token",
          client_id: "client",
          client_secret: "secret",
          refresh_token: refreshToken,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      configureAxios();  // Update the axios instance with the new access token
      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  },

  // Handles token refresh when 401 error is received
  async handleTokenRefresh(retryFunction, ...args) {
    try {
      await this.refreshAccessToken();
      return await retryFunction(...args);  // Retry the failed function with the new token
    } catch (refreshError) {
      console.error("Error refreshing access token:", refreshError);
      throw refreshError;
    }
  },
};


export { axiosInstance, TokenManager, configureAxios };
