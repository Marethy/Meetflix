import { axiosInstance, TokenManager, configureAxios } from "./apiClient";
import {message} from "antd";
const TheaterApi = {
  async createTheater(theaterData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/api/v1/theater`, theaterData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createTheater, theaterData);
      }
      console.error("Error creating theater:", error);
      throw error;
    }
  },

  async getTheaters() {
    const response = await axiosInstance.get(`/api/v1/theater`, {
      headers: { Authorization: undefined }, 
    });
    return response.data;
  },
  

  async updateTheater(theaterId, theaterData) {
    configureAxios();
    console.log("123"+ theaterId); // Kiểm tra theaterId
    console.log(`API URL: /api/v1/theater/${theaterId}`);


    try {
      const response = await axiosInstance.put(`/api/v1/theater/${theaterId}`, theaterData);

      message.success("Theater from api updated successfully");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.updateTheater, theaterId, theaterData);
      }
      console.error("Error updating theater:", error);
      throw error;
    }
  },

  async deleteTheater(theaterId) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(`api/v1/theater/${theaterId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteTheater, theaterId);
      }
      console.error("Error deleting theater:", error);
      throw error;
    }
  }
};

export default TheaterApi;