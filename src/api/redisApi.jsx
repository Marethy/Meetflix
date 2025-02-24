import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const RedisApi = {
  async addTicketToOrder(userId, addTicketRequest) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/redis`, addTicketRequest, {
        headers: { "X-Auth-User-Id": userId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.addTicketToOrder, userId, addTicketRequest);
      }
      console.error("Error adding ticket to order:", error);
      throw error;
    }
  },

  async getSeatsOrdered(userId) {
    configureAxios();
    try {
      const response = await axiosInstance.get(`/redis/customer`, {
        headers: { "X-Auth-User-Id": userId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getSeatsOrdered, userId);
      }
      console.error("Error getting seats ordered:", error);
      throw error;
    }
  },

  async deleteTicketFromOrder(userId, deleteTicketRequest) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(`/redis/ticket`, {
        headers: { "X-Auth-User-Id": userId },
        data: deleteTicketRequest,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteTicketFromOrder, userId, deleteTicketRequest);
      }
      console.error("Error deleting ticket from order:", error);
      throw error;
    }
  },

  async deleteAllTicketsFromOrder(userId) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(`/redis/all`, {
        headers: { "X-Auth-User-Id": userId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteAllTicketsFromOrder, userId);
      }
      console.error("Error deleting all tickets from order:", error);
      throw error;
    }
  }
};

export default RedisApi;