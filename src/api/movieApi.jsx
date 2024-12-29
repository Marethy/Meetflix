import { axiosInstance, TokenManager, configureAxios } from "./apiClient";

const MovieApi = {
  async getMovies() {
    try {
      const response = await axiosInstance.get(`/api/v1/movie`, {
        headers: { Authorization: undefined },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  async getMovieById(id) {
    try {
      const response = await axiosInstance.get(`/api/v1/movie/${id}`, {
        headers: { Authorization: undefined },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie by ID:", error);
      throw error;
    }
  },

  async createMovie(movieData) {
    configureAxios();
    try {
      const response = await axiosInstance.post(`/api/v1/movie`, movieData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.createMovie,
          movieData
        );
      }
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  async updateMovie(id, movieData) {
    configureAxios();
    try {
      const response = await axiosInstance.put(
        `/api/v1/movie/${id}`,
        movieData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.updateMovie,
          id,
          movieData
        );
      }
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  async deleteMovie(id) {
    configureAxios();
    try {
      await axiosInstance.delete(`/api/v1/movie/${id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(this.deleteMovie, id);
      }
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  async getMoviesByIds(ids) {
    try {
      const response = await axiosInstance.get(`/api/v1/movie/ids`, {
        params: { ids },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by IDs:", error);
      throw error;
    }
  },
  
  async getMoviesByTheater(theaterId) {
    try {
      const response = await axiosInstance.get(
        `/api/v1/movie/theater/${theaterId}`,
        {
          headers: { Authorization: undefined },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by theater ID:", error);
      throw error;
    }
  },

  async rateMovie(movieId, rating_point) {
    configureAxios();
    try {
      const response = await axiosInstance.put("/api/v1/movie/rating", {
        movieId,
        rating_point,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.rateMovie,
          movieId,
          rating_point
        );
      }
      console.error("Error rating movie:", error);
      throw error;
    }
  },
  async searchMovies(searchText) {
    configureAxios();
    try {
      const response = await axiosInstance.get(`/api/v1/movie/search`, {
        params: { searchText },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return await TokenManager.handleTokenRefresh(
          this.searchMovies,
          searchText
        );
      }
      console.error("Error searching movies:", error);
      throw error;
    }
  },
};

export default MovieApi;
