import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovieApi, CategoryApi } from "../../../api"; // Assuming you have a CategoryApi
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
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

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

  // Mutation to update a movie
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
  // Show modal to add or update movie
  const showModal = (movie = null) => {
    setSelectedMovie(movie);
    if (movie) {
      form.setFieldsValue({
        ...movie,
        releaseDate: movie.releaseDate ? moment(movie.releaseDate) : null,
        category_id: movie.categories.map((category) => category.id),
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

  // Movie table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Country", dataIndex: "country", key: "country" },
    { title: "Release Date", dataIndex: "releaseDate", key: "releaseDate" },
    { title: "Duration (min)", dataIndex: "durationMin", key: "durationMin" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => showModal(record)}>
            Update
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
      <Button type="primary" onClick={() => showModal()}>
        Add Movie
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
          <Form.Item name="actors" label="Actors" rules={[{ required: true }]}>
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
      {loadingMovies ? (
        <Spin tip="Loading movies..." />
      ) : (
        <Table
          dataSource={movies}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default MovieManagement;
