import React from "react";

const SelectDate = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <div className="flex gap-4 justify-center mt-6">
      {dates.map((date) => (
        <button
          key={date.id}
          onClick={() => onSelectDate(date)}
          className={`py-2 px-4 rounded-lg font-semibold ${
            selectedDate?.id === date.id
              ? "bg-yellow-400 text-black"
              : "bg-transparent border border-yellow-400 text-yellow-400"
          }`}
        >
          <p>{date.formattedDate}</p>
          <p>{date.weekday}</p>
        </button>
      ))}
    </div>
  );
};

export default SelectDate;
