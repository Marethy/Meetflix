import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const CategoryApi = {
  async getAllCategories() {
    configureAxios();
    const response = await axiosInstance.get("/api/v1/category");
    return response.data;
  },

  async createCategory(categoryData) {
    configureAxios();
    const response = await axiosInstance.post("/api/v1/category", categoryData, {
    });
    return response.data;
  },
};

export default CategoryApi;
