"use client";

import React, { useState, useMemo } from "react";
import styles from "./index.module.css";

export default function DateSelector({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dates = useMemo(() => {
    const dateArray = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    console.log("Selected Date", selectedDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date >= today) {
      onDateSelect(date);
    }
  };

  return (
    <div className={styles.dateSelector}>
      <div className={styles.dateNavigation}>
        <button onClick={handlePrevMonth} className={styles.navigationButton}>
          &lt;
        </button>

        <div className={styles.monthDisplay}>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </div>

        <button onClick={handleNextMonth} className={styles.navigationButton}>
          &gt;
        </button>
      </div>

      <div className={styles.dateGrid}>
        {dates.map((date, index) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const isToday = date.toDateString() === today.toDateString();
          const isPastDate = date < today;
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              className={`
                ${styles.dateCell} 
                ${isToday ? styles.today : ""} 
                ${isSelected ? styles.selected : ""}
                ${isPastDate ? styles.disabled : ""}
              `}
              onClick={() => !isPastDate && handleDateSelect(date)}
            >
              <div className={styles.dayOfWeek}>
                {date.toLocaleString("default", { weekday: "short" })}
              </div>
              <div className={styles.dateNumber}>{date.getDate()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
