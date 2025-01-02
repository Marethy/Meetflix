import React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale"; // Thêm locale tiếng Việt

const WeekDays = ({ selectedDate, onDateSelect }) => {
  const startDate = new Date(); // Hôm nay là ngày đầu tiên
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="flex gap-4">
      {days.map((date) => (
        <button
          key={date.toISOString()}
          className={`py-2 px-4 text-center rounded-lg transform hover:-translate-y-[6px] ease-in-out duration-300 ${
            format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              ? "bg-yellow-500 text-black"
              : "bg-black text-yellow-500 border-yellow-500 border"
          }`}
          onClick={() => onDateSelect(date)}
        >
          <div className="text-lg font-bold">{format(date, "dd/MM")}</div>
          <div className="text-sm">
            {format(date, "EEEE", { locale: vi })} {/* Hiển thị tên ngày bằng tiếng Việt */}
          </div>
        </button>
      ))}
    </div>
  );
};

export default WeekDays;
