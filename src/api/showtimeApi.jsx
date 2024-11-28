import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const ShowtimeApi = {
  async createShowtime(showtimeData, movieId, theaterId, roomId) {
    configureAxios();
    try {
      const response = await axiosInstance.post(
        `api/v1/showtime`,
        showtimeData,
        {
          params: {
            movie: movieId,
            theater: theaterId,
            projectionRoom: roomId,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.createShowtime,
          showtimeData,
          movieId,
          theaterId,
          roomId
        );
      }
      console.error("Error creating showtime:", error);
      throw error;
    }
  },

  async getShowtimesByMovieId(id) {
    const response = await axiosInstance.get(`api/v1/showtime/movie/${id}`, {
      headers: { Authorization: undefined },
    });
    return response.data;
  },

  async getShowtimesByRoomId(id) {
    const response = await axiosInstance.get(`api/v1/showtime/room/${id}`, {
      headers: { Authorization: undefined },
    });
    return response.data;
  },

  async updateShowtime(id, showtimeData) {
    configureAxios();
    try {
      const response = await axiosInstance.put(`/showtime/${id}`, showtimeData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.updateShowtime,
          id,
          showtimeData
        );
      }
      console.error("Error updating showtime:", error);
      throw error;
    }
  },

  async getShowtimeFromOrder(requests) {
    const response = await axiosInstance.post(`/showtime/order`, requests, {
      headers: { Authorization: undefined },
    });
    return response.data;
  },
};

export default ShowtimeApi;
