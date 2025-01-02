import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

const SeatSelection = ({ seats, orderedSeats, selectedSeats, onSeatSelect }) => {
  const rows = "ABCDEFGHIJKLMN".split("");

  const grid = Array.from({ length: rows.length }, () => Array(14).fill(null));

  seats.forEach((seat) => {
    const seatName = seat.name;
    const rowIndex = rows.indexOf(seatName.slice(-1)); // Extract the row letter and find its index
    const columnIndex = parseInt(seatName.match(/\d+/)[0], 10) - 1; // Extract the column number and adjust for 0-based index
    grid[rowIndex][columnIndex] = seat;
  });

  const handleSeatClick = (seat) => {
    onSeatSelect((prevSelectedSeats) => {
      if (prevSelectedSeats.some((s) => s.name === seat.name)) {
        return prevSelectedSeats.filter((s) => s.name !== seat.name);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  };

  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        paddingTop: 8,
        zIndex: 10,
        borderTop: "2px solid #222",
      }}
    >
      <Box
        sx={{
          width: 0.8,
          height: "100px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "320px",
            height: "140px",
            border: `2px solid red`,
            borderRadius: 2,
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingX: 2,
            paddingY: 1,
            justifyItems: "flex-start",
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Selected Seats:
          </Typography>
          <Typography sx={{ color: "lightgray", fontSize: 14 }}>
            {selectedSeats
              .map((seat) => `${seat.name.slice(-1)}${seat.name.slice(0, -1)}`)
              .join(", ")}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "240px",
            height: "140px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "lightgray", fontWeight: "bold", mt: -2, ml: -2 }}
          >
            Note:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Available Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "gray",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Resersed Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "red",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Selected Seat
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 4,
          mt: 10,
          py: 10,
          border: "2px solid gray",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            mb: 1,
          }}
        >
          SCREEN
        </Typography>
        <div className="h-3 w-[600px] bg-white rounded-full self-center items-center mb-2" />
        <Box
          sx={{
            height: 360,
            px: 20,
            display: "grid",
            alignItems: 'center',
            placeItems: 'center',
            gridTemplateColumns: `repeat(14, 42px)`,
            gridTemplateRows: `repeat(13, 30px)`,
            justifyContent: "center",
            gap: 1,
            marginTop: 6,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((seat, columnIndex) => (
              <Box
                key={`${rowIndex}-${columnIndex}`}
                sx={{
                  gridRow: rowIndex + 1,
                  gridColumn: columnIndex + 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {seat ? (
                  <SeatUnit
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.some((s) => s.name === seat.name)}
                    onClick={handleSeatClick}
                    isOrdered={orderedSeats.includes(seat.name)}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 42,
                      height: 26,
                    }}
                  />
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

const SeatUnit = ({ seat, isSelected, onClick, isOrdered }) => {
  const getBackgroundColor = (status, isSelected) => {
    if (isOrdered) {
      return "gray";
    }
    if (isSelected) {
      return 'red';
    }
    return "white";
  };
  return (
    <Box
      onClick={() => onClick(seat)}
      sx={{
        width: 42,
        height: 26,
        borderRadius: "4px",
        backgroundColor: getBackgroundColor(isSelected),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Typography sx={{ color: "black", fontSize: 14, fontWeight: "bold" }}>
        {`${seat.name.slice(-1)}${seat.name.slice(0, -1)}`}
      </Typography>
    </Box>
  );
};

export default SeatSelection;
