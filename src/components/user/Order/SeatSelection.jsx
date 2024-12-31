import React, { useState } from "react";
import clsx from "clsx";

const SeatSelection = ({ availableSeats, selectedSeats, onSeatSelect }) => {
  const [error, setError] = useState("");

  const handleSeatToggle = (seat) => {
    if (seat.isReserved) {
      setError("Ghế này đã được đặt trước.");
      setTimeout(() => setError(""), 2000); // Ẩn lỗi sau 2 giây
      return;
    }

    const isSelected = selectedSeats.includes(seat.id);
    const updatedSeats = isSelected
      ? selectedSeats.filter((s) => s !== seat.id) // Bỏ ghế khỏi danh sách
      : [...selectedSeats, seat.id]; // Thêm ghế vào danh sách

    onSeatSelect(updatedSeats);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Chọn ghế:</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-8 gap-2">
        {availableSeats.map((seat) => (
          <button
            key={seat.id}
            className={clsx(
              "w-10 h-10 rounded text-center flex items-center justify-center border transition",
              {
                "bg-gray-400 text-white cursor-not-allowed": seat.isReserved, // Ghế đã đặt
                "bg-blue-500 text-white hover:bg-blue-600": !seat.isReserved && selectedSeats.includes(seat.id), // Ghế đang chọn
                "bg-gray-200 text-black hover:bg-gray-300": !seat.isReserved && !selectedSeats.includes(seat.id), // Ghế khả dụng
              }
            )}
            onClick={() => handleSeatToggle(seat)}
            disabled={seat.isReserved}
          >
            {seat.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="text-md font-semibold">Ghế đã chọn:</h4>
        {selectedSeats.length > 0 ? (
          <p className="text-green-500">{selectedSeats.join(", ")}</p>
        ) : (
          <p className="text-gray-500">Chưa có ghế nào được chọn.</p>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
