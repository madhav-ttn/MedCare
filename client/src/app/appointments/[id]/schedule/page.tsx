"use client";
import DateSelector from "@/app/_components/DateSelector";
import styles from "./page.module.css";
import Slots from "@/app/_components/Slots";
import { Slot } from "@/lib/types/types";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/_components/Loader";
import Cookies from "js-cookie";
import { authContext } from "@/context/Auth/authContext";

export default function Schedule() {
  const [appointmentType, setAppointmentType] = useState<
    "virtual" | "in_person"
  >("virtual");

  const { user, handleAuth } = useContext(authContext);
  const [currDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const [slotData, setSlotData] = useState<{
    morningSlots: Slot[] | null;
    eveningSlots: Slot[] | null;
  }>({
    morningSlots: null,
    eveningSlots: null,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const path = usePathname();
  const token = Cookies.get("user");
  useEffect(() => {
    async function getDoctorData() {
      try {
        setIsLoading(true);
        const arr = path.split("/");
        const id = arr[arr.length - 2];
        if (!selectedDate) setSelectedDate(currDate);
        const date = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : currDate.toISOString().split("T")[0];
        const res: { data: { success: boolean; data: Slot[] } } =
          await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/slots/${id}/${date}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        if (!res.data.success) {
          throw new Error("Error in getting doctor slots");
        }
        const slots = res.data.data;
        const morningSlots = slots.filter(
          (slot) => Number(slot.start_time.slice(0, 2)) <= 12
        );
        const eveningSlots = slots.filter(
          (slot) => Number(slot.start_time.slice(0, 2)) > 12
        );
        console.log(morningSlots);
        console.log(eveningSlots);
        setIsLoading(false);
        setSlotData({ morningSlots, eveningSlots });
      } catch (error) {
        console.log("Error in getting doctor slots", error);
      }
    }
    getDoctorData();
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleAppointmentBooking = async () => {
    try {
      setIsLoading(true);
      if (!selectedDate || !selectedSlot) {
        setIsLoading(false);
        toast.info("Select Your slot and date properly");
        return;
      }
      if (slotData.morningSlots === null || slotData.eveningSlots === null) {
        toast.info("No slots available");
        return;
      }
      const res: any = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments`,
        {
          doctor_id: slotData.morningSlots[0].doctor_id,
          patient_id: user?.id,
          doctor_slot_id: selectedSlot,
          appointment_date: selectedDate,
          type: appointmentType,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.data.success) {
        setIsLoading(false);
        toast.error("Something went wrong");
        return;
      }
      setIsLoading(false);
      setSelectedSlot(null);
      setSelectedDate(currDate);
      toast.success("Appointment booked Successfully");
    } catch (error) {
      setIsLoading(false);
      console.log("Error in booking appointments", error);
    }
  };

  if (isLoading)
    return (
      <div style={{ height: "100vh" }}>
        <Loader />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.leftsection}>
        <div>
          <p>Book Your Next Doctor Visit in Seconds.</p>
          <p>
            CareMate helps you find the best healthcare provider by speciality,
            location, and more, ensuring you get the care you need.
          </p>
        </div>
      </div>
      <div className={styles.rightsection}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <p>Schedule Appointment</p>
            <button>Book Appointment</button>
          </div>
          <div className={styles.booking}>
            <button
              className={
                appointmentType === "virtual" ? styles.activeButton : ""
              }
              onClick={() => setAppointmentType("virtual")}
            >
              Book Video Consult
            </button>
            <button
              className={
                appointmentType === "in_person" ? styles.activeButton : ""
              }
              onClick={() => setAppointmentType("in_person")}
            >
              Book Hospital Visit
            </button>
          </div>
          {slotData &&
          appointmentType == "in_person" &&
          slotData.morningSlots &&
          slotData.morningSlots.length > 0 ? (
            <p className={`${styles.locationInfo} ${styles.success}`}>
              {slotData.morningSlots[0].location}
            </p>
          ) : (
            appointmentType == "in_person" && (
              <p className={styles.locationInfo}>Slots does not exist</p>
            )
          )}
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <Slots
            selectedSlot={selectedSlot}
            handleSlotSelection={handleSlotSelect}
            isMorning={true}
            slotData={slotData.morningSlots}
          />
          <Slots
            selectedSlot={selectedSlot}
            handleSlotSelection={handleSlotSelect}
            isMorning={false}
            slotData={slotData.eveningSlots}
          />
          <button
            disabled={isLoading}
            onClick={() => handleAppointmentBooking()}
          >
            {isLoading ? "Booking in Progress..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
