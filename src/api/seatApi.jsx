import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const SeatApi = {
  async getSeats({ showtime, projectionRoomId, movieId, theaterId }) {
    configureAxios();

    try {
      const response = await axiosInstance.get("/api/v1/seat", {
        params: {
          showtime,
          projectionRoomId,
          movieId,
          theaterId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching seat data:", error);
      throw error;
    }
  },
};

export default SeatApi;
