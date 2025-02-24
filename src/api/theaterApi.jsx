import { axiosInstance, TokenManager, configureAxios } from "./apiClient";
import { message } from "antd";

const TheaterApi = {
  // Create a new theater
  async createTheater(theaterData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/api/v1/theater`, theaterData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.createTheater,
          theaterData
        );
      }
      console.error("Error creating theater:", error);
      throw error;
    }
  },

  // Get all theaters
  async getTheaters() {
    try {
      const response = await axiosInstance.get(`/api/v1/theater`, {
        headers: { Authorization: undefined },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching theaters:", error);
      throw error;
    }
  },

  // Get theater by ID
  async getTheaterById(theaterId) {
    try {
      const response = await axiosInstance.get(`/api/v1/theater/${theaterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching theater with ID ${theaterId}:`, error);
      throw error;
    }
  },

  // Update a theater by ID
  async updateTheater({ theaterId, theaterData }) {
    configureAxios();
    try {
      const response = await axiosInstance.put(
        `/api/v1/theater/${theaterId}`,
        theaterData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.updateTheater,
          theaterId,
          theaterData
        );
      }
      console.error("Error updating theater:", error);
      throw error;
    }
  },

  // Delete a theater by ID
  async deleteTheater(theaterId) {
    configureAxios();
    try {
      const response = await axiosInstance.delete(
        `/api/v1/theater/${theaterId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.deleteTheater,
          theaterId
        );
      }
      console.error("Error deleting theater:", error);
      throw error;
    }
  },

  async getTheaterWithShowtime({ movieId, date }) {
    configureAxios();
    try {
      if (!movieId || !date) {
        throw new Error("movieId và date là bắt buộc");
      }

      const response = await axiosInstance.get(`/api/v1/theater/specific`, {
        params: { movieId, date }, 
        
      });

      console.log("Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
      throw error; 
    }
  },
};
export default TheaterApi;
