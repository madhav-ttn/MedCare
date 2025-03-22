"use client"
import Image from "next/image";
import data from "@/data/data.json"
import DoctorCard from "@/app/_components/Card";
import styles from "./page.module.css";
import SideCard from "../_components/SideCard";
import { useRef, useState } from "react";

export default function Appointments() {
  const [rating, setRating] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("Show All");
  const [doctors,setDoctors]=useState(data);


  const ratingCardRef = useRef<{value:string, resetRadios: () => void } | null>(null);
  const experienceCardRef = useRef<{value:string ,resetRadios: () => void } | null>(null);
  const genderCardRef = useRef<{ value:string,resetRadios: () => void } | null>(null);
  
  const handleFilter = (type: string, value: string) => {
    switch(type) {
      case "rating":
        console.log("change in ratings",Number(value[0]));
        setDoctors(data.filter((doctor)=>doctor.ratings >= Number(value[0])))
        setRating(value);
        break;
      case "experience":
        setExperience(value);
        break;
      case "gender":
        setGender(value);
        break;
      default:
        break;
    }
  }
  
  return(
    <div className={styles.parent}>
      <div className={styles.hero}>
        <p className={styles.heading}>Find a doctor at your own ease</p>
        <div className={styles.searchSection}>
          <Image src={"/search.svg"} alt="" width={20} height={20} style={{position:"absolute",top:"24px",left:"16px"}}/>
          <input type="text" placeholder="Search Doctors"/>
          <button>Search</button>
        </div>
      </div>
      <div className={styles.doctorsSection}>
        <p className={styles.heading}>6 doctors available</p>
        <p className={styles.subheading}>Book appointments with minimum wait-time & verified doctor details</p>
        <div className={styles.sidebar}>
          <aside>
            <div className={styles.details}>
              <span>Filter By:</span>
              <span onClick={()=>{
                ratingCardRef.current?.resetRadios();
                experienceCardRef.current?.resetRadios();
                genderCardRef.current?.resetRadios();
              }}>Reset</span>
            </div>
            <SideCard title="Rating" data={["1 star","2 star","3 star","4 star","5 star"]} handleFilter={handleFilter} ref={ratingCardRef}/>
            <SideCard title="Experience" data={["15+ years","10-15 years","5-10 years","3-5 years","1-3 years","0-1 years"]} handleFilter={handleFilter} ref={experienceCardRef}/>
            <SideCard title="Gender" data={["Show All","Male","Female"]} handleFilter={handleFilter} ref={genderCardRef}/>
          </aside>
          <div className={styles.doctorList}>
            {doctors.map((doctor) => (
              <div key={doctor.id}>
                <DoctorCard doctor={doctor}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}