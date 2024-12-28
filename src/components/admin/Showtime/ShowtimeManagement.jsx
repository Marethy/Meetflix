import React, { useState } from "react";
import { Button, Popconfirm, Form, Input, Select, DatePicker, Modal, Table, message, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovieApi, ShowtimeApi } from "../../../api";
import moment from "moment";

const ShowtimeManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: showtimes = [], isLoading: loadingShowtimes } = useQuery({
    queryKey: ["showtimes"],
    queryFn: ShowtimeApi.getShowtimes,
  });

  const { data: movies = [], isLoading: loadingMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
    
  });
console.log(movies);
  const { data: projectionRooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["projectionRooms"],
    queryFn: ShowtimeApi.getProjectionRooms,
  });

  const { data: theaters = [], isLoading: loadingTheaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: ShowtimeApi.getTheaters,
  });

  // Mutation cho việc tạo, cập nhật và xóa showtime
  const createShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime created successfully");
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to create showtime");
    },
  });

  const updateShowtimeMutation = useMutation({
    mutationFn: ({ showtimeId, showtimeData }) => ShowtimeApi.updateShowtime(showtimeId, showtimeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime updated successfully");
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to update showtime");
    },
  });

  const deleteShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete showtime");
    },
  });

  const showModal = (showtime = null) => {
    setSelectedShowtime(showtime);
    if (showtime) {
      form.setFieldsValue({
        ...showtime,
        startTime: showtime.startTime ? moment(showtime.startTime) : null,
        movie_id: showtime.movie_id,
        projectionRoom_id: showtime.projectionRoom_id,
        theater_id: showtime.theater_id,
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        startTime: values.startTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        movie_id: values.movie_id,
        projectionRoom_id: values.projectionRoom_id,
        theater_id: values.theater_id,
      };

      if (selectedShowtime) {
        updateShowtimeMutation.mutate({
          showtimeId: selectedShowtime.id,
          showtimeData: payload,
        });
      } else {
        createShowtimeMutation.mutate(payload);
      }

      setIsModalVisible(false);
      setSelectedShowtime(null);
    } catch (error) {
      console.error(error);
      message.error("Failed to save showtime");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    deleteShowtimeMutation.mutate(id);
  };

  const columns = [
    { title: "Start Time", dataIndex: "startTime", key: "startTime", render: (startTime) => moment(startTime).format("YYYY-MM-DD HH:mm:ss") },
    { title: "Movie", dataIndex: "movie_id", key: "movie_id", render: (movieId) => movies.find(movie => movie.id === movieId)?.title || "Unknown" },
    { title: "Room", dataIndex: "projectionRoom_id", key: "projectionRoom_id", render: (roomId) => projectionRooms.find(room => room.id === roomId)?.name || "Unknown" },
    { title: "Theater", dataIndex: "theater_id", key: "theater_id", render: (theaterId) => theaters.find(theater => theater.id === theaterId)?.name || "Unknown" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record)} style={{ marginRight: "10px" }}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this showtime?"
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
        Add Showtime
      </Button>

      <Modal
        title={selectedShowtime ? "Update Showtime" : "Add Showtime"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select the start time!" }]}>
            <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
  name="movie_id"
  label="Movie"
  rules={[{ required: true, message: "Please select a movie!" }]}>
  <Select placeholder="Select a movie" loading={loadingMovies}>
    {(movies?.content || []).map((movie) => (
      <Select.Option key={movie.id} value={movie.id}>
        {movie.name} {/* Sử dụng movie.name thay vì movie.title */}
      </Select.Option>
    ))}
  </Select>
</Form.Item>


          <Form.Item
            name="projectionRoom_id"
            label="Projection Room"
            rules={[{ required: true, message: "Please select a projection room!" }]}>
            <Select placeholder="Select a room" loading={loadingRooms}>
              {projectionRooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="theater_id"
            label="Theater"
            rules={[{ required: true, message: "Please select a theater!" }]}>
            <Select placeholder="Select a theater" loading={loadingTheaters}>
              {theaters.map((theater) => (
                <Select.Option key={theater.id} value={theater.id}>
                  {theater.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {loadingShowtimes ? (
        <Spin tip="Loading showtimes..." />
      ) : (
        <Table
          dataSource={showtimes}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default ShowtimeManagement;
