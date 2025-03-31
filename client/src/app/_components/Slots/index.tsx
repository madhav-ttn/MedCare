import styles from "./index.module.css";
import { Slot } from "@/lib/types/types";

export default function Slots({
  isMorning,
  slotData,
  selectedSlot,
  handleSlotSelection,
}: {
  isMorning: boolean;
  slotData: Slot[] | null;
  selectedSlot: number | null;
  handleSlotSelection: (slotId: number) => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.subheader}>
          <p>{isMorning ? "Morning" : "Evening"}</p>
        </div>
        <p>{slotData?.length} slots</p>
      </div>
      <hr />
      <div className={styles.slotsection}>
        {slotData && slotData?.length !== 0 ? (
          slotData.map((slot: Slot, id: number) => (
            <button
              key={id}
              onClick={() => handleSlotSelection(slot.id)}
              disabled={slot.is_available === false}
              className={selectedSlot === slot.id ? styles.selectedSlot : ""}
            >
              {slot.start_time.slice(0, 5)} {isMorning ? "AM" : "PM"}
            </button>
          ))
        ) : (
          <p>No Slots Exist for this date</p>
        )}
      </div>
    </div>
  );
}
