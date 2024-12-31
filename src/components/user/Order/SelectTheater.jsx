import React from 'react';

const SelectTheater = ({ theaters, selectedTheater, onTheaterSelect }) => {
  return (
    <div className="mb-6 text-white mx-auto">
      <h3 className="text-lg font-semibold">SELECT THEATER</h3>
      <div className="flex flex-wrap gap-4 mt-2">
        {theaters.map((theater) => (
          <button
            key={theater.id}
            onClick={() => onTheaterSelect(theater)}
            className={`py-2 px-4 rounded-lg shadow ${
              selectedTheater?.id === theater.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {theater.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectTheater;
