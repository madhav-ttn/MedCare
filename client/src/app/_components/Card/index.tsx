import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Doctor } from "@/lib/types/types";

export default function DoctorCards({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const handleCardClick = () => {
    router.push(`appointments/${doctor.id}`);
  };
  return (
    <div onClick={handleCardClick} className={styles.cardContainer}>
      <div className={styles.subcontainer}>
        <Image src={"/Doctor.svg"} alt="" width={150} height={150} />
        <div className={styles.details}>
          <p className={styles.name}>{doctor.name}</p>
          <div className={styles.specialisation}>
            <p>
              <Image src={"/Stethoscope.svg"} alt="" width={17.5} height={15} />
              <span>{doctor.speciality}</span>
            </p>
            <p>
              <Image src={"/Hourglass.svg"} alt="" width={17.5} height={15} />
              <span>{doctor.experience} years</span>
            </p>
          </div>
        </div>
        <p>Ratings : {doctor.rating}</p>
      </div>
      <Link
        className={styles.appointmentButton}
        href={`appointments/${doctor.id}/schedule`}
      >
        Book Appointment
      </Link>
    </div>
  );
}
