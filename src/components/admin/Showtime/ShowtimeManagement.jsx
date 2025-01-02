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
import { ShowtimeApi, TheaterApi } from "../../../api"; // Giả định bạn đã có API để gọi
import moment from "moment";

const ShowtimeManagement = ({ movieId, onBack }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: showtimes, isLoading: loadingShowtimes } = useQuery({
    queryKey: ["showtimes", movieId],
    queryFn: () => ShowtimeApi.getShowtimesByMovieId(movieId),
  });

  const { data: theaters, isLoading: loadingTheaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: TheaterApi.getTheaters,
  });

  const createShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes", movieId]);
      message.success("Showtime created successfully");
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to create showtime");
    },
  });

  const updateShowtimeMutation = useMutation({
    mutationFn: ({ showtimeId, showtimeData }) => {
      return ShowtimeApi.updateShowtime(showtimeId, showtimeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes", movieId]);
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
      queryClient.invalidateQueries(["showtimes", movieId]);
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
        startTime: moment(showtime.startTime),
        theater_id: showtime.theater_id,
        projectionRoom_id: showtime.projectionRoom_id,
      });
      setSelectedTheater(showtime.theater_id);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        startTime: values.startTime.format("YYYY-MM-DD HH:mm:ss"),
        movie_id: movieId,
        theater_id: values.theater_id,
        projectionRoom_id: values.projectionRoom_id,
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

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
    form.resetFields();
    setSelectedTheater(null);
  };

  const handleDelete = (id) => {
    deleteShowtimeMutation.mutate(id);
  };

  const columns = [
    {
      title: "Showtime ID",
      dataIndex: "id",
      key: "id",
      render: (id) => id,
      sorter: (a, b) => a.id - b.id, // Sắp xếp theo ID
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => (moment(a.startTime).isBefore(b.startTime) ? -1 : 1), // Sắp xếp theo Start Time
    },
    {
      title: "Theater",
      dataIndex: "projectionRoom",
      key: "theater_id",
      render: (projectionRoom) => {
        return projectionRoom ? `Theater ${projectionRoom.id}` : "Unknown";
      },
      sorter: (a, b) =>
        (a.projectionRoom?.id || 0) - (b.projectionRoom?.id || 0), 
    },
    {
      title: "Projection Room",
      dataIndex: "projectionRoom",
      key: "projectionRoom_id",
      render: (projectionRoom) => {
        return projectionRoom ? projectionRoom.number : "Unknown";
      },
      sorter: (a, b) =>
        (a.projectionRoom?.number || 0) - (b.projectionRoom?.number || 0),
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
      <Button onClick={onBack} className="mb-4">
        Back to Movies
      </Button>
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
            name="theater_id"
            label="Theater"
            rules={[{ required: true, message: "Please select a theater!" }]}
          >
            <Select
              placeholder="Select theater"
              onChange={(value) => setSelectedTheater(value)}
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
