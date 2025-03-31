import slotModel from "../models/slotModel";

const slotService = {
  createSlots(
    doctor_id: number,
    date: Date,
    startTimeForSlots: string,
    endTimeForSlots: string
  ) {
    const slotArray = [];
    let currentTime = new Date(`${date}T${startTimeForSlots}:00`);
    const endTime = new Date(`${date}T${endTimeForSlots}:00`);

    while (currentTime < endTime) {
      const start = currentTime.toTimeString().split(" ")[0];
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      const end = currentTime.toTimeString().split(" ")[0];

      slotArray.push({
        doctor_id,
        date,
        start_time: start,
        end_time: end,
        is_available: true,
      });
    }
    return slotArray;
  },

  async registerSlots(doctor_id: number, date: Date) {
    try {
      const morningShift = this.createSlots(doctor_id, date, "09:00", "12:00");
      const eveningShift = this.createSlots(doctor_id, date, "15:00", "18:00");

      const allSlots = [...morningShift, ...eveningShift];
      const response = await slotModel.createSlots(allSlots);
      return { success: true, data: response };
    } catch (error: any) {
      console.log("error:slotservice > registerSlot", error.message);
      return { success: false, data: error.message };
    }
  },
};

export default slotService;
