import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TheaterApi, SeatApi, ShowtimeApi } from "../../api";
import { message, Spin } from "antd";
import WeekDays from "../../components/WeekDays"; // Import WeekDays
import {
  SelectShowtime,
  SeatSelection,
  SelectTheater,
} from "../../components/user/Order";

const OrderPage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { data: theaters = [], isLoading: isLoadingTheaters } = useQuery({
    queryKey: ["theaters", movieId, selectedDate],
    queryFn: async () => {
      const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString().split("T")[0]
        : null;
      const numericMovieId = movieId ? Number(movieId) : null;

      if (numericMovieId && formattedDate) {
        return await TheaterApi.getTheaterWithShowtime({
          movieId: numericMovieId,
          date: formattedDate,
        });
      } else {
        return [];
      }
    },
    enabled: !!movieId && !!selectedDate,
  });

  console.log("theaters:", theaters);

  const { data: availableSeats = [], isFetching: isFetchingSeats } = useQuery({
    queryKey: ["seats", selectedShowtime?.id, selectedTheater?.id],
    queryFn: () =>
      selectedShowtime && selectedTheater
        ? SeatApi.getSeats({
            showtime: selectedShowtime.startTime,
            projectionRoomId: selectedShowtime.projectionRoom.id,
            movieId: movieId,
            theaterId: selectedTheater.id,
          })
        : [], //
    enabled: !!selectedShowtime && !!selectedTheater, 
  });

  // Mutation for confirming the order
  const confirmOrderMutation = useMutation({
    mutationFn: (orderData) => ShowtimeApi.createOrder(orderData),
    onSuccess: (response) => {
      message.success("Đặt vé thành công!");
      navigate(`/user/orders/${response.orderId}`);
    },
    onError: () => {
      message.error("Không thể đặt vé. Vui lòng thử lại.");
    },
  });

  // Handle order confirmation
  const handleConfirmOrder = () => {
    if (!selectedShowtime || !selectedTheater || selectedSeats.length === 0) {
      message.warning("Vui lòng hoàn tất các bước chọn.");
      return;
    }

    const orderData = {
      showtime: selectedShowtime.startTime,
      projectionRoomId: selectedShowtime.projectionRoom.id,
      movieId,
      theaterId: selectedTheater.id,
      seats: selectedSeats,
      movieName: selectedShowtime.movieName,
      theaterName: selectedTheater.name,
      roomName: selectedShowtime.roomName,
    };

    confirmOrderMutation.mutate(orderData); // Handle the order creation
  };

  return (
    <div className="container mx-auto my-20 px-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Đặt vé xem phim</h2>

      {/* Step 1: Select Date with WeekDays */}
      <WeekDays selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Step 2: Select Showtimes */}
      {selectedDate &&
        (isLoadingTheaters ? (
          <Spin tip="Đang tải ra..." />
        ) : (
          <SelectShowtime
            showtimes={theaters.flatMap((theater) => theater.showTimes)}
            selectedShowtime={selectedShowtime}
            onShowtimeSelect={setSelectedShowtime}
          />
        ))}

      {/* Step 3: Select Theaters */}
      {selectedShowtime &&
        (isLoadingTheaters ? (
          <Spin tip="Đang tải danh sách rạp..." />
        ) : (
          <SelectTheater
            theaters={theaters}
            selectedTheater={selectedTheater}
            onTheaterSelect={setSelectedTheater}
          />
        ))}

      {/* Step 4: Select Seats */}
      {selectedShowtime &&
        selectedTheater &&
        (isFetchingSeats ? (
          <Spin tip="Đang tải ghế..." />
        ) : (
          <SeatSelection
            availableSeats={availableSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={setSelectedSeats}
          />
        ))}

      {/* Confirm Order */}
      <button
        onClick={handleConfirmOrder}
        className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        disabled={confirmOrderMutation.isLoading || !selectedSeats.length}
      >
        {confirmOrderMutation.isLoading ? "Đang xử lý..." : "Xác nhận đặt vé"}
      </button>
    </div>
  );
};

export default OrderPage;
