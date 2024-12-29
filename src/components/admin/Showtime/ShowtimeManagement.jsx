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
import { ShowtimeApi, MovieApi, TheaterApi } from "../../../api"; // Giả định bạn đã có API để gọi
import moment from "moment";

const ShowtimeManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null); // State to store selected theater
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: showtimes, isLoading: loadingShowtimes } = useQuery({
    queryKey: ["showtimes"],
    queryFn: ShowtimeApi.getAllShowtimes, // API để lấy danh sách showtimes
  });
  const { data: movies, isLoading: loadingMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
    select: (data) => data.content,
  });

  // Lấy tất cả theaters từ API
  const { data: theaters, isLoading: loadingTheaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: TheaterApi.getTheaters,
  });

  // Mutation để tạo mới showtime
  const createShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime created successfully");
      form.resetFields();
    },
    onError: (error) => {
      message.error("Failed to create showtime");
    },
  });

  // Mutation để cập nhật showtime
  const updateShowtimeMutation = useMutation({
    mutationFn: ({ showtimeId, showtimeData }) =>
      ShowtimeApi.updateShowtime(showtimeId, showtimeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime updated successfully");
      form.resetFields();
    },
    onError: (error) => {
      message.error("Failed to update showtime");
    },
  });

  // Mutation để xóa showtime
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

  // Hiển thị modal để chỉnh sửa hoặc tạo showtime mới
  const showModal = (showtime = null) => {
    setSelectedShowtime(showtime);
    if (showtime) {
      form.setFieldsValue({
        ...showtime,
        startTime: moment(showtime.startTime),
        movie_id: showtime.movie_id,
        projectionRoom_id: showtime.projectionRoom_id,
        theater_id: showtime.theater_id,
      });
      setSelectedTheater(showtime.theater_id); // Set selected theater when editing showtime
    }
    setIsModalVisible(true);
  };

  // Xử lý khi nhấn OK trong modal
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        startTime: values.startTime.format("YYYY-MM-DD HH:mm:ss"),
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
      message.error("Failed to save showtime");
    }
  };

  // Xử lý khi nhấn Cancel trong modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
    form.resetFields();
    setSelectedTheater(null); // Reset selected theater
  };

  // Xử lý khi xóa showtime
  const handleDelete = (id) => {
    deleteShowtimeMutation.mutate(id);
  };

  const columns = [
    {
      title: "Movie",
      dataIndex: "movie_id",
      key: "movie_id",
      render: (movieId) => {
        const movie = movies?.find((movie) => movie.id === movieId);
        console.log("Movie:", movie);  // Debugging: Check if movie is found
        return movie ? movie.name : "Unknown";
      },
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => {
        console.log("Start Time:", startTime);  // Debugging: Check if startTime is valid
        return startTime ? moment(startTime).format("YYYY-MM-DD HH:mm:ss") : "Unknown";
      },
    },
    {
      title: "Projection Room",
      dataIndex: "projectionRoom_id",
      key: "projectionRoom_id",
      render: (projectionRoomId) => {
        const projectionRoom = theaters?.find((theater) =>
          theater.projectionRoomList?.some((room) => room.id === projectionRoomId)
        );
        console.log("Projection Room:", projectionRoom);  // Debugging: Check if projectionRoom is found
        return projectionRoom ? projectionRoom.name : "Unknown";
      },
    },
    {
      title: "Theater",
      dataIndex: "theater_id",
      key: "theater_id",
      render: (theaterId) => {
        const theater = theaters?.find((theater) => theater.id === theaterId);
        console.log("Theater:", theater);  // Debugging: Check if theater is found
        return theater ? theater.name : "Unknown";
      },
    },
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
            rules={[
              { required: true, message: "Please select the start time!" },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="movie_id"
            label="Movie"
            rules={[{ required: true, message: "Please select a movie!" }]}
          >
            <Select placeholder="Select movie">
              {movies?.length ? (
                movies.map((movie) => (
                  <Select.Option key={movie.id} value={movie.id}>
                    {movie.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No movies available</Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="theater_id"
            label="Theater"
            rules={[{ required: true, message: "Please select a theater!" }]}
          >
            <Select
              placeholder="Select theater"
              onChange={(value) => setSelectedTheater(value)} // Update selected theater
            >
              {theaters?.map((theater) => (
                <Select.Option key={theater.id} value={theater.id}>
                  {theater.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="projectionRoom_id"
            label="Projection Room"
            rules={[
              { required: true, message: "Please select a projection room!" },
            ]}
          >
            <Select placeholder="Select projection room">
              {selectedTheater
                ? theaters
                    ?.find((theater) => theater.id === selectedTheater)
                    ?.projectionRoomList.map((room) => (
                      <Select.Option key={room.id} value={room.id}>
                        {room.number}
                      </Select.Option>
                    ))
                : null}
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
