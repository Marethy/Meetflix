import React, { useState, useEffect } from "react";
import moment from "moment";
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
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  useEffect(() => {
    console.log("Selected Seats:", selectedSeats);
  }, [selectedSeats]);
  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      if (movieId) {
        return await MovieApi.getMovieById(movieId);
      }
      return null;
    },
    enabled: !!movieId,
  });

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

  const { data: availableSeats = [], isFetching: isFetchingSeats } = useQuery({
    queryKey: ["seats", selectedShowtime?.id, selectedTheater?.id],
    queryFn: () => {
      if (selectedShowtime && selectedTheater) {
        const formattedStartTime = moment(selectedShowtime.startTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        return SeatApi.getSeats({
          showtime: formattedStartTime,
          projectionRoomId: selectedShowtime.projectionRoom.id,
          movieId: movieId,
          theaterId: selectedTheater.id,
        }).catch(() => {
          return { allSeats, orderedSeat };
        });
      } else {
        return { allSeats: [], orderedSeat: [] };
      }
    },
    enabled: !!selectedShowtime && !!selectedTheater,
  });
  console.log(selectedSeats);
  console.log(availableSeats);
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
      showtime: moment(selectedShowtime.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      projectionRoomId: selectedShowtime.projectionRoom.id,
      movieId,
      theaterId: selectedTheater.id,
      seats: selectedSeats,
      movieName: movieData.name,
      theaterName: selectedTheater.name,
      roomName: selectedShowtime.projectionRoom.number,
    };

    console.log("Order Data:", orderData);

    navigate(`/user/cinema_movies/${movieId}/checkout`, {
      state: { orderData },
    });
  };
  return (
    <div className="container w-full items-center flex flex-col py-20 px-[20%] text-white">
      <p className="text-5xl font-bold w-full tracking-widest">
        ĐẶT VÉ XEM PHIM
      </p>

      {isLoadingMovie ? (
        <Spin tip="Đang tải thông tin phim..." />
      ) : (
        movieData && (
          <div className="flex flex-row md:flex-row gap-8 mx-auto items-center my-10">
            {/* Movie Poster */}
            <div className="  flex-shrink-0">
              <img
                src={movieData.urlImage}
                alt={movieData.name}
                className="ml-20 rounded-lg shadow-lg w-[50%] "
              />
            </div>
            <div className="flex flex-col items-start justify-start">
            <p>
              <span className="text-lg font-semibold text-[#666]">Phim: </span>
              <span className="text-lg font-semibold text-[#999]">
                {movieData.name}
              </span>
            </p>
            <span className="text-lg font-semibold text-[#666]">Mô tả: </span>
            <span className="text-lg font-semibold text-[#999] overflow-hidden whitespace-nowrap text-ellipsis w-[50%]">
              {movieData.description}
            </span></div>
          </div>
        )
      )}

      <WeekDays selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      {/* Bước 2: Chọn rạp */}
      {selectedDate && isLoadingTheaters ? (
        <Spin tip="Đang tải danh sách rạp..." />
      ) : (
        <SelectTheater
          theaters={theaters}
          selectedTheater={selectedTheater}
          onTheaterSelect={setSelectedTheater}
        />
      )}

      {/* Bước 3: Chọn suất chiếu */}
      {selectedDate &&
        selectedTheater &&
        (isLoadingTheaters ? (
          <Spin tip="Đang tải rạp chiếu..." />
        ) : (
          <SelectShowtime
            showtimes={theaters.flatMap((theater) => theater.showTimes)}
            selectedShowtime={selectedShowtime}
            onShowtimeSelect={setSelectedShowtime}
          />
        ))}

      {/* Bước 4: Chọn ghế */}
      {selectedShowtime &&
        selectedTheater &&
        (isFetchingSeats ? (
          <Spin tip="Đang tải ghế..." />
        ) : (
          <SeatSelection
            seats={availableSeats.allSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={setSelectedSeats}
          />
        ))}

      {/* Điều khoản xác nhận */}
      <div className="mt-4">
        <input
          type="checkbox"
          id="terms"
          value={acceptedTerms}
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
