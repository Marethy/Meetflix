import React, { useState } from "react";
import { Table, Button, Popconfirm, message, Modal } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MovieFormModal from "./MovieFormModal";
import MovieApi from "../../../api/MovieApi";

const MovieList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
  });

  const deleteMovieMutation = useMutation({
    mutationFn: MovieApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success("Movie deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting movie:", error);
      message.error("Failed to delete movie");
    },
  });

  const handleDelete = (id) => {
    deleteMovieMutation.mutate(id);
  };

  const showModal = (movie = null) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
    },
    {
      title: "Duration (min)",
      dataIndex: "durationMin",
      key: "durationMin",
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
            Edit
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
    <>
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add Movie
      </Button>
      <Table
        dataSource={movies?.content || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: movies?.pageNo + 1,
          pageSize: movies?.pageSize,
          total: movies?.totalElement,
        }}
      />
      {isModalVisible && (
        <MovieFormModal
          visible={isModalVisible}
          onClose={handleModalClose}
          movie={selectedMovie}
        />
      )}
    </>
  );
};

export default MovieList;
