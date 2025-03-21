import styles from "./page.module.css";
import Slots from "@/app/_components/Slots";
import data from "@/data/data.json";
export default function Schedule(){
    return(
        <div className={styles.container}>
            <div className={styles.leftsection}>
                <div>
                    <p>Book Your Next Doctor Visit in Seconds.</p>
                    <p>CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.</p>
                </div>
            </div>
            <div className={styles.rightsection}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <p>Schedule Appointment</p>
                        <button>Book Appointment</button>
                    </div>
                    <div className={styles.booking}>
                        <button>Book Video Consult</button>
                        <button>Book Hospital Visit</button>
                    </div>
                    <p>{data[0].location}</p>
                    <Slots isMorning={true} data={data[0].slots_available.morning}/>
                    <Slots isMorning={false} data={data[0].slots_available.evening}/>
                    <button>Next</button>
                </div>
            </div>
        </div>
    )
}