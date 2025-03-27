import styles from "./index.module.css";
import DoctorCard from "../Card";
import { Doctor } from "@/lib/types/types";

export default function DoctorsGrid({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) {
    return <h1>No Doctors exist</h1>;
  }
  return (
    <div className={styles.doctorList}>
      {doctors &&
        doctors.map((doctor: Doctor) => (
          <div key={doctor.id}>
            <DoctorCard doctor={doctor} />
          </div>
        ))}
    </div>
  );
}
