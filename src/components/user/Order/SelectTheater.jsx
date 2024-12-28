import React from "react";

const SelectTheater = ({ theaters, selectedTheater, onTheaterSelect }) => {
    console.log(theaters)
  return (
    
    <div className="mb-6 text-white mx-auto">
      <h3 className="text-lg font-semibold">DANH SÁCH RẠP</h3>
      <div className="flex flex-col gap-4 mt-2">
        {theaters.map((theater) => (
          <button
            key={theater.id}
            onClick={() => onTheaterSelect(theater)}
            className={`py-2 px-4 text-left rounded-lg shadow border ${
              selectedTheater?.id === theater.id
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <h4 className="font-bold">{theater.name}</h4>
            <p className="text-sm">{theater.address}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectTheater;
