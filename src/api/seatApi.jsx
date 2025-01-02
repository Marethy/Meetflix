import { axiosInstance, configureAxios } from "./apiClient";

const SeatApi = {
  async getSeats({ showtime, projectionRoomId, movieId, theaterId }) {
    configureAxios();

    try {
      const response = await axiosInstance.post("/api/v1/seat", 
        {
          showtime,
          projectionRoomId,
          movieId,
          theaterId,
        }
      );
      console.log("seat", JSON.stringify(response.data, null, 2)); // Hiển thị dữ liệu ghế ở dạng JSON đẹp
      return response.data;
    } catch (error) {
      console.error("Error fetching seat data:", error);
      throw error;
    }
  },
};

export default SeatApi;
