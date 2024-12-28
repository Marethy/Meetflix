import React, { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovieApi } from "../../../api";
import moment from "moment";

const MovieManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: movies, isLoading: loadingMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
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
    mutationFn: ({ movieId, movieData }) => MovieApi.updateMovie(movieId, movieData),
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

  const showModal = (movie = null) => {
    setSelectedMovie(movie);
    if (movie) {
      form.setFieldsValue({
        ...movie,
        releaseDate: movie.releaseDate ? moment(movie.releaseDate) : null,
        category_id: movie.category_id,
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
        director: values.director,
        actors: values.actors,
        urlImage: values.urlImage,
        category_id: values.category_id,
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
      console.error(error);
      message.error("Failed to save movie");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    deleteMovieMutation.mutate(id);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (releaseDate) => (releaseDate ? moment(releaseDate).format("YYYY-MM-DD") : "N/A"),
    },
    { title: "Duration (min)", dataIndex: "durationMin", key: "durationMin" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: "10px" }}
          >
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
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-100">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add Movie
      </Button>
      <Modal
        title={selectedMovie ? "Update Movie" : "Add Movie"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the movie name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the movie description!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please input the country!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: "Please select the release date!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="durationMin"
            label="Duration (minutes)"
            rules={[{ required: true, message: "Please input the duration!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="director"
            label="Directors"
            rules={[{ required: true, message: "Please input at least one director!" }]}
          >
            <Select mode="tags" placeholder="Enter director names" />
          </Form.Item>
          <Form.Item
            name="actors"
            label="Actors"
            rules={[{ required: true, message: "Please input at least one actor!" }]}
          >
            <Select mode="tags" placeholder="Enter actor names" />
          </Form.Item>
          <Form.Item
            name="urlImage"
            label="Image URL"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Categories"
            rules={[{ required: true, message: "Please select at least one category!" }]}
          >
            <Select mode="multiple" placeholder="Select categories" />
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
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default MovieManagement;
