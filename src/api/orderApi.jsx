import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const OrderApi = {
  async createOrder(orderData) {
    configureAxios();
    try {
      const response = await axiosInstance.post("/api/v1/order", orderData, {
        headers: { "X-Auth-User-Id": orderData.userId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createOrder, orderData);
      }
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async getOrdersByCustomer(userId) {

    try {
      const response = await axiosInstance.get(`/api/v1/order/customer`, {
        headers: { "X-Auth-User-Id": userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by customer:", error);
      throw error;
    }
  },

  async deleteOrderTicket(orderData) {
    
    configureAxios();
    try {
      const response = await axiosInstance.delete("/api/v1/order/ticket", {
        headers: { "X-Auth-User-Id": orderData.userId },
        data: orderData,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteOrderTicket, orderData);
      }
      console.error("Error deleting order ticket:", error);
      throw error;
    }
  },

  async deleteAllOrders(userId) {
    try {
      const response = await axiosInstance.delete("/api/v1/order/all", {
        headers: { "X-Auth-User-Id": userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting all orders:", error);
      throw error;
    }
  },
};

export default OrderApi;
