import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const UserApi = {
  async getOrderbyUserId(userId) {
    configureAxios();
    const response = await axiosInstance.get(`/api/v1/order/customer/${userId}`);
    return response.data;
  },
  async getUser(userId) {
    configureAxios();
    const response = await axiosInstance.get(`/api/v1/user/${userId}`);
    return response.data;
  },
  async getAllUser() {
    configureAxios();
    const response = await axiosInstance.get(`/api/v1/user/all`);
    return response.data;
  },

  async createUser(userData) {
    const response = await axiosInstance.post("/api/v1/user", userData, {
      headers: { Authorization: undefined }, // Remove Authorization header
    });
    return response.data;
  },
  async updateUser(userId, userData) {
    configureAxios();

    try {
      const response = await axiosInstance.put(
        `/api/v1/user/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.updateUser,
          userId,
          userData
        );
      }
      console.error("Error updating user:", error);
      throw error;
    }
  },
  async deleteUser(userId) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(`api/v1/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteUser, userId);
      }
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

export default UserApi;
