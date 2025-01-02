import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TheaterApi, SeatApi, MovieApi } from "../../api"; // Đảm bảo rằng MovieApi đã được import
import { message, Spin } from "antd";
import WeekDays from "../../components/WeekDays"; // Import WeekDays
import {
  SelectShowtime,
  SeatSelection,
  SelectTheater,
} from "../../components/user/Order";

const OrderPage = () => {
  const { id: movieId } = useParams(); // Lấy ID phim từ URL
  const navigate = useNavigate(); // Điều hướng sau khi đặt vé thành công

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Trạng thái checkbox điều khoản

  // Fetch thông tin phim theo movieId
  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      if (movieId) {
        return await MovieApi.getMovieById(movieId); // API lấy thông tin phim theo movieId
      }
      return null;
    },
    enabled: !!movieId, // Chỉ gọi API khi có movieId
  });

  // Fetch danh sách rạp có suất chiếu theo ngày và phim
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

  // Fetch danh sách ghế có sẵn theo suất chiếu và rạp
  const { data: availableSeats = [], isFetching: isFetchingSeats } = useQuery({
    queryKey: ["seats", selectedShowtime?.id, selectedTheater?.id],
    queryFn: () => {
      if (selectedShowtime && selectedTheater) {
        const formattedStartTime = new Date(selectedShowtime.startTime)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        return SeatApi.getSeats({
          showtime: formattedStartTime,
          projectionRoomId: selectedShowtime.projectionRoom.id,
          movieId: movieId,
          theaterId: selectedTheater.id,
        }).catch(() => {
          return { allSeats: [], orderedSeat: [] };
        });
      } else {
        return { allSeats: [], orderedSeat: [] };
      }
    },
    enabled: !!selectedShowtime && !!selectedTheater, 
  });

  const handleConfirmOrder = () => {
    if (!selectedShowtime || !selectedTheater || selectedSeats.length === 0) {
      message.warning("Vui lòng hoàn tất các bước chọn.");
      return;
    }

    if (!acceptedTerms) {
      message.warning("Vui lòng đồng ý với điều khoản trước khi tiếp tục.");
      return;
    }

    const orderData = {
      showtime: selectedShowtime.startTime,
      projectionRoomId: selectedShowtime.projectionRoom.id,
      movieId,
      theaterId: selectedTheater.id,
      seats: selectedSeats,
      movieName: movieData.name,
      theaterName: selectedTheater.name,
      roomName: selectedShowtime.roomName,
    };

    console.log("Order Data:", orderData);

    navigate(`/user/cinema_movies/${movieId}/checkout`, { state: { orderData } });
  };

  return (
    <div className="container mx-auto my-20 px-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Đặt vé xem phim</h2>

      {/* Hiển thị thông tin phim */}
      {isLoadingMovie ? (
        <Spin tip="Đang tải thông tin phim..." />
      ) : (
        movieData && (
          <div className="movie-info">
            <h3 className="text-xl font-semibold">{movieData.name}</h3>
            <p>{movieData.description}</p>
          </div>
        )
      )}

      {/* Bước 1: Chọn ngày */}
      <WeekDays selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Bước 2: Chọn suất chiếu */}
      {selectedDate &&
        (isLoadingTheaters ? (
          <Spin tip="Đang tải rạp chiếu..." />
        ) : (
          <SelectShowtime
            showtimes={theaters.flatMap((theater) => theater.showTimes)}
            selectedShowtime={selectedShowtime}
            onShowtimeSelect={setSelectedShowtime}
          />
        ))}

      {/* Bước 3: Chọn rạp */}
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

      {/* Bước 4: Chọn ghế */}
      {selectedShowtime &&
        selectedTheater &&
        (isFetchingSeats ? (
          <Spin tip="Đang tải ghế..." />
        ) : (
          <SeatSelection
            availableSeats={availableSeats.allSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={setSelectedSeats}
          />
        ))}

      {/* Điều khoản xác nhận */}
      <div className="mt-4">
        <input
          type="checkbox"
          id="terms"
          onChange={(e) => setAcceptedTerms(e.target.checked)}
        />
        <label htmlFor="terms" className="ml-2">
          Đồng ý với{" "}
          <a href="/terms" target="_blank" className="text-blue-500">
            điều khoản
          </a>
          .
        </label>
      </div>

      {/* Nút xác nhận đặt vé */}
      <button
        onClick={handleConfirmOrder}
        className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        disabled={!selectedSeats.length || !acceptedTerms}
      >
        Xác nhận đặt vé
      </button>
    </div>
  );
};

export default OrderPage;
