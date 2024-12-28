import React from "react";

const SelectShowtime = ({ showtimes, selectedShowtime, onShowtimeSelect }) => {
  console.log(showtimes);

  return (
    <div className="mb-6 text-white mx-auto ">
      <h3 className="text-lg font-semibold">SELECT SHOWTIME</h3>
      <div className="flex flex-wrap gap-4 mt-2">
        {showtimes.map((showtime) => (
          <button
            key={showtime.id}
            onClick={() => onShowtimeSelect(showtime)}
            className={`py-2 px-4 rounded-lg shadow ${
              selectedShowtime?.id === showtime.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {showtime.startTime}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectShowtime;
