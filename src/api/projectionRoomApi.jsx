import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const ProjectionRoomApi = {
  async getAllRoomByMovieID(id) {
    configureAxios();
    try {
      const response = await axiosInstance.get(`/projectionRoom/movie/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.getAllRoomByMovieID, id);
      }
      console.error("Error fetching projection rooms by movie ID:", error);
      throw error;
    }
  },

  async createRoom(theaterId, roomData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/projectionRoom/theater/${theaterId}`, roomData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.createRoom, theaterId, roomData);
      }
      console.error("Error creating projection room:", error);
      throw error;
    }
  }
};

export default ProjectionRoomApi;