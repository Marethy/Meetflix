import React from "react";
import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const statisticApi = {
  async getStatistic() {
    configureAxios();
    try {
      const response = await axiosInstance.get("/api/v1/statistic");
      return response.data; 
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },
};
export default statisticApi;
