import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {TheaterApi,SeatApi,ShowtimeApi} from "../../api";
import { message } from "antd";
import {SelectShowtime} from "../../components/user/Order";

const OrderPage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSnacks, setSelectedSnacks] = useState([]);

  const { data: showtimes = [] } = useQuery({
    queryKey: ["showtimes", movieId],
    queryFn: () => ShowtimeApi.getShowtimesByMovieId(movieId),
  });

  const { data: theaters = [] } = useQuery({
    queryKey: ["theaters"],
    queryFn: TheaterApi.getTheaters,
  });

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

  const handleConfirmOrder = () => {
    if (!selectedShowtime || !selectedTheater || selectedSeats.length === 0) {
      message.warning("Vui lòng hoàn tất các bước chọn.");
      return;
    }

    const orderData = {
      showtimeId: selectedShowtime.id,
      theaterId: selectedTheater.id,
      seats: selectedSeats,
      snacks: selectedSnacks,
    };

    confirmOrderMutation.mutate(orderData);
  };

  return (
    <div className="container mx-auto my-20 px-4">
      <h2 className="text-2xl font-bold mb-6">Đặt vé xem phim</h2>

      <SelectShowtime
        showtimes={showtimes}
        selectedShowtime={selectedShowtime}
        onShowtimeSelect={setSelectedShowtime}
        className= "text-white"
      />
      {selectedShowtime && (
        <SelectTheater
          theaters={theaters}
          selectedTheater={selectedTheater}
          onTheaterSelect={setSelectedTheater}
        />
      )}


      <button
        onClick={handleConfirmOrder}
        className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        disabled={confirmOrderMutation.isLoading}
      >
        {confirmOrderMutation.isLoading ? "Đang xử lý..." : "Xác nhận đặt vé"}
      </button>
    </div>
  );
};

export default OrderPage;
