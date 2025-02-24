import React from "react";
import { Modal, Form, Input, DatePicker, InputNumber, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MovieApi from "../../../api/MovieApi";
import moment from "moment";

const MovieFormModal = ({ visible, onClose, movie }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isEditing = Boolean(movie);

  const mutation = useMutation({
    mutationFn: (newMovie) =>
      isEditing
        ? MovieApi.updateMovie(movie.id, newMovie)
        : MovieApi.createMovie(newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success(isEditing ? "Movie updated successfully" : "Movie added successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Error saving movie:", error);
      message.error("Failed to save movie");
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare the payload with the required fields
      const payload = {
        name: values.name,
        description: values.description,
        country: values.country,
        releaseDate: values.releaseDate.format("YYYY-MM-DD"),
        durationMin: values.durationMin,
        urlImage: values.urlImage,
        // Include default or user-provided data for director and actors
        director: values.director || [{ id: 0, name: "Unknown Director" }],
        actors: values.actors || [{ id: 0, name: "Unknown Actor" }],
        // Ensure that categories are also properly handled if necessary
        categories: values.categories || [{ id: 0, name: "Unknown Category", thumbnailUrl: "", url_key: "" }],
      };

      console.log("Payload:", payload); // Log to check the structure

      // Trigger the mutation to send the data
      mutation.mutate(payload);
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Movie" : "Add Movie"}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          movie
            ? {
                ...movie,
                releaseDate: movie.releaseDate ? moment(movie.releaseDate) : null,
                director: movie.director || [{ id: 0, name: "Unknown Director" }],
                actors: movie.actors || [{ id: 0, name: "Unknown Actor" }],
                categories: movie.categories || [{ id: 0, name: "Unknown Category", thumbnailUrl: "", url_key: "" }],
              }
            : {}
        }
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter movie name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: "Please enter country!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="releaseDate"
          label="Release Date"
          rules={[{ required: true, message: "Please select release date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="durationMin"
          label="Duration (min)"
          rules={[{ required: true, message: "Please enter duration!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="urlImage" label="Image URL">
          <Input />
        </Form.Item>
        {/* Optional fields for director and actors */}
        <Form.Item name="director" label="Director">
          <Input placeholder="Enter director name" />
        </Form.Item>
        <Form.Item name="actors" label="Actors">
          <Input placeholder="Enter actors' names" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieFormModal;
