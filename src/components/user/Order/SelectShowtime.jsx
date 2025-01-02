import React from "react";
import moment from "moment";

const SelectShowtime = ({ showtimes, selectedShowtime, onShowtimeSelect }) => {
  console.log(showtimes);

  return (
    <div className="mb-6 text-white mx-auto ">
      <h3 className="text-xl font-bold tracking-wider mt-6">SELECT SHOWTIME</h3>
      <div className="flex flex-wrap gap-4 mt-2">
        {showtimes.map((showtime) => (
          <button
            key={showtime.id}
            onClick={() => onShowtimeSelect(showtime)}
            className={`py-2 px-4 rounded-lg shadow ${
              selectedShowtime?.id === showtime.id
                ? 'bg-yellow-500 text-black'
                : 'bg-black text-yellow-500 font-bold border border-yellow-500'
            }`}
          >
            {moment(showtime.startTime).format("HH:mm")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectShowtime;
