import React from "react";

const SelectDate = ({ dates = [], selectedDate, onDateSelect }) => {
  if (!dates || !Array.isArray(dates)) {
    return <div>Không có dữ liệu ngày nào để hiển thị.</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Chọn ngày:</h3>
      <div className="flex gap-4">
        {dates.map((date) => (
          <button
            key={date}
            className={`py-2 px-4 rounded-lg ${
              selectedDate === date ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
            }`}
            onClick={() => onDateSelect(date)}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectDate;
