import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ShowtimeManagement from "../Showtime/ShowtimeManagement";
import { MovieApi, CategoryApi, ShowtimeApi } from "../../../api"; // Assuming you have a CategoryApi
import moment from "moment";
import {
  Button,
  Popconfirm,
  Form,
  Input,
  Select,
  Spin,
  message,
  Modal,
  Table,
  DatePicker,
} from "antd";

const MovieManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryThumbnailUrl, setCategoryThumbnailUrl] = useState("");
  const [categoryUrlKey, setCategoryUrlKey] = useState("");
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState("movieManagement");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const navigateToShowtimeManagement = (movieId) => {
    setSelectedMovieId(movieId);
    setCurrentView("showtimeManagement");
  };

  const navigateBackToMovies = () => {
    setCurrentView("movieManagement");
    setSelectedMovieId(null);
  };
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryApi.getAllCategories,
    select: (data) => data,
  });

  const { data: movies, isLoading: loadingMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
    select: (data) => data.content,
  });

  const createMovieMutation = useMutation({
    mutationFn: MovieApi.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success("Movie created successfully");
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to create movie");
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: ({ movieId, movieData }) =>
      MovieApi.updateMovie(movieId, movieData),
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success("Movie updated successfully");
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to update movie");
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: MovieApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success("Movie deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete movie");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: CategoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      message.success("Category created successfully");
      setCategoryName("");
      setCategoryThumbnailUrl("");
      setCategoryUrlKey("");
      setIsCategoryModalVisible(false);
    },
    onError: () => {
      message.error("Failed to create category");
    },
  });

  const showModal = (movie = null) => {
    setSelectedMovie(movie);
    if (movie) {
      form.setFieldsValue({
        ...movie,
        releaseDate: movie.releaseDate ? moment(movie.releaseDate) : null,
        category_id: movie.categories.map((category) => category.id),
        actors: movie.actors.map((actor) => actor.name),
        director: movie.director.map((dir) => dir.name),
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description,
        country: values.country,
        releaseDate: values.releaseDate.format("YYYY-MM-DD"),
        durationMin: values.durationMin,
        director: values.director.map((name) => ({ name })),
        actors: values.actors.map((name) => ({ name })),
        urlImage: values.urlImage,
        category_id: values.category_id, // category_id is an array of IDs
      };

      if (selectedMovie) {
        updateMovieMutation.mutate({
          movieId: selectedMovie.id,
          movieData: payload,
        });
      } else {
        createMovieMutation.mutate(payload);
      }

      setIsModalVisible(false);
      setSelectedMovie(null);
    } catch (error) {
      message.error("Failed to save movie");
    }
  };
  const handleDelete = (id) => {
    deleteMovieMutation.mutate(id);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
    form.resetFields();
  };

  // Handle the category modal
  const showCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCategoryOk = async () => {
    if (categoryName && categoryThumbnailUrl && categoryUrlKey) {
      createCategoryMutation.mutate({
        name: categoryName,
        thumbnailUrl: categoryThumbnailUrl,
        url_key: categoryUrlKey,
      });
    } else {
      message.error("All category fields are required");
    }
  };

  const handleCategoryCancel = () => {
    setIsCategoryModalVisible(false);
    setCategoryName("");
    setCategoryThumbnailUrl("");
    setCategoryUrlKey("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      sorter: (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    },
    {
      title: "Duration (min)",
      dataIndex: "durationMin",
      key: "durationMin",
      sorter: (a, b) => a.durationMin - b.durationMin,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => showModal(record)}>
            Update
          </Button>
          <Button
            type="default"
            onClick={() => navigateToShowtimeManagement(record.id)}
            className="bg-yellow-500 text-white hover:bg-yellow-400"
          >
            Manage Showtime
          </Button>

          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-700 text-white">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {currentView === "movieManagement" && (
        <>
          <Button type="primary" onClick={() => showModal()}>
            Add Movie
          </Button>
          <Button
            type="default"
            onClick={showCategoryModal}
            style={{ marginLeft: 8 }}
          >
            Add Category
          </Button>
          <Modal
            title={selectedMovie ? "Update Movie" : "Add Movie"}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="releaseDate"
                label="Release Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                name="durationMin"
                label="Duration (min)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="director"
                label="Directors"
                rules={[{ required: true }]}
              >
                <Select mode="tags" placeholder="Enter director names" />
              </Form.Item>
              <Form.Item
                name="actors"
                label="Actors"
                rules={[{ required: true }]}
              >
                <Select mode="tags" placeholder="Enter actor names" />
              </Form.Item>
              <Form.Item
                name="urlImage"
                label="Image URL"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category_id"
                label="Categories"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one category!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select categories"
                  options={
                    categories
                      ? categories.map((category) => ({
                          value: category.id,
                          label: category.name,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Form>
          </Modal>

          {/* Category Modal */}
          <Modal
            title="Add Category"
            visible={isCategoryModalVisible}
            onOk={handleCategoryOk}
            onCancel={handleCategoryCancel}
          >
            <Form layout="vertical">
              <Form.Item
                label="Category Name"
                required
                rules={[
                  {
                    required: true,
                    message: "Please input the category name!",
                  },
                ]}
              >
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Thumbnail URL"
                required
                rules={[
                  {
                    required: true,
                    message: "Please input the thumbnail URL!",
                  },
                ]}
              >
                <Input
                  value={categoryThumbnailUrl}
                  onChange={(e) => setCategoryThumbnailUrl(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="URL Key"
                required
                rules={[
                  { required: true, message: "Please input the URL key!" },
                ]}
              >
                <Input
                  value={categoryUrlKey}
                  onChange={(e) => setCategoryUrlKey(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>

          <Table
            loading={loadingMovies || loadingCategories}
            columns={columns}
            dataSource={movies}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1000 }}
            F
          />
        </>
      )}
      {currentView === "showtimeManagement" && (
        <ShowtimeManagement
          movieId={selectedMovieId}
          onBack={navigateBackToMovies}
        />
      )}
    </div>
  );
};

export default MovieManagement;
