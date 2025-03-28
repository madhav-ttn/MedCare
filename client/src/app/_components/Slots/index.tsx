import Image from "next/image";
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
          <Image
            src={isMorning ? "/sun.svg" : "/sunset.svg"}
            alt=""
            width={24}
            height={22}
          />
          {isMorning ? <p>Morning</p> : <p>Evening</p>}
        </div>
        <p>{slotData?.length} slots</p>
      </div>
      <div className={styles.slotsection}>
        {slotData && slotData?.length !== 0 ? (
          slotData.map((slot: Slot, id: number) => (
            <button
              key={id}
              onClick={() => handleSlotSelection(slot.id)}
              disabled={slot.is_available === false}
            >
              {slot.start_time.slice(0, 5)} {isMorning ? "AM" : "PM"}
            </button>
          ))
        ) : (
          <h1>No Slots Exist for this date</h1>
        )}
      </div>
    </div>
  );
}
