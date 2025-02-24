import React from 'react';

const SelectTheater = ({ theaters, selectedTheater, onTheaterSelect }) => {
  return (
    <div className="mb-6 text-white mx-auto">
      <h3 className="text-xl font-bold tracking-wider mt-6">SELECT THEATER</h3>
      <div className="flex flex-wrap gap-4 mt-2">
        {theaters.map((theater) => (
          <button
            key={theater.id}
            onClick={() => onTheaterSelect(theater)}
            className={`py-2 px-4 rounded-lg shadow  ${
              selectedTheater?.id === theater.id
                ? 'bg-yellow-500 text-black'
                : 'bg-black text-yellow-500 font-bold border border-yellow-500'
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
