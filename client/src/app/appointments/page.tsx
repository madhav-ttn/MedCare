"use client";
import axios from "axios";
import styles from "./page.module.css";
import SideCard from "../_components/SideCard";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import DoctorsGrid from "../_components/DoctorsGrid";
import { Doctor } from "@/lib/types/types";
import SearchBar from "../_components/SearchBar";
import PaginationControl from "../_components/PaginationControl";
import Loader from "../_components/Loader";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function Appointments() {
  const [filterDetails, setFilterDetails] = useState({
    rating: "",
    experience: "",
    gender: "",
  });
  const [initialPages, setInitialPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoc, setFilteredDoc] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [currPageNumber, setCurrPageNumber] = useState<number>(1);
  const [currDocState, setcurrDocState] = useState({
    isFiltered: false,
    isSearched: false,
  });
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get("user");
    if (!token) router.push("/login");
    setIsLoading(false);
  }, []);
  const currPageSetter = (value: number) => {
    setCurrPageNumber(value);
    setTimeout(() => {
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    }, 100);
  };

  const searchQuerySetter = (query: string) => {
    setSearchQuery(query);
  };

  const handleLoader = (state: boolean) => {
    setIsLoading(state);
  };

  const handleFilteredDocState = async (searchQuery: string) => {
    try {
      const filterUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/filter/${currPageNumber}?rating=${filterDetails.rating}&experience=${filterDetails.experience}&gender=${filterDetails.gender}&searchQuery=${searchQuery}`;

      const result: any = await axios.get(filterUrl);
      if (result.data) {
        const doc = result.data.doctors;
        setcurrDocState({ ...currDocState, isSearched: true });
        setTotalPages(Math.ceil(doc[0].total_records / 6));
        setTotalDoctors(doc[0].total_records);
        setFilteredDoc(doc);
      }
    } catch (error) {
      console.log("Error in getting the searched data");
    }
  };

  useEffect(() => {
    async function getDoctors() {
      try {
        setIsLoading(true);
        let result: any = null;

        const hasActiveFilters =
          filterDetails.rating ||
          filterDetails.experience ||
          filterDetails.gender;

        if (hasActiveFilters) {
          const filterUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/filter/${currPageNumber}?rating=${filterDetails.rating}&experience=${filterDetails.experience}&gender=${filterDetails.gender}`;
          result = await axios.get(filterUrl);
          setFilteredDoc(result.data.doctors);
        } else {
          result = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/${currPageNumber}`
          );
          setDoctors(result.data.doctors);
        }

        if (result.data.success) {
          if (result.data.doctors.length === 0) {
            setIsLoading(false);
            return;
          }
          const total_records = result.data.doctors[0].total_records;
          const total_pages = Math.ceil(total_records / 6);
          setInitialPages(total_pages);
          setTotalPages(total_pages);
          setTotalDoctors(total_records);
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Something went wrong. Try refreshing the page");
        console.log("Error in getting the appointments", error);
        setIsLoading(false);
      }
    }
    getDoctors();
  }, [currPageNumber]);

  const ratingCardRef = useRef<{
    resetRadios: () => void;
  } | null>(null);
  const experienceCardRef = useRef<{
    resetRadios: () => void;
  } | null>(null);
  const genderCardRef = useRef<{
    resetRadios: () => void;
  } | null>(null);

  const handleFilterStates = (type: string, value: string) => {
    switch (type) {
      case "rating":
        setFilterDetails({ ...filterDetails, rating: value });
        break;
      case "gender":
        setFilterDetails({ ...filterDetails, gender: value });
        break;
      case "experience":
        setFilterDetails({ ...filterDetails, experience: value });
        break;
    }
  };

  const handleFilter = async () => {
    try {
      setIsLoading(true);
      const hasActiveFilters =
        filterDetails.rating ||
        filterDetails.experience ||
        filterDetails.gender;
      if (!hasActiveFilters) {
        toast.info("No filters choosen yet");
        setIsLoading(false);
        return;
      }
      setcurrDocState({ ...currDocState, isFiltered: true });
      const filterUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/filter/1?rating=${filterDetails.rating}&experience=${filterDetails.experience}&gender=${filterDetails.gender}&searchQuery=${searchQuery}`;
      const result: any = await axios.get(filterUrl);
      if (result.data.doctors.length === 0) {
        setIsLoading(false);
        return;
      }
      const total_records = result.data.doctors[0].total_records;
      const total_pages = Math.ceil(total_records / 6);

      setTotalPages(total_pages);
      setCurrPageNumber(1);
      setFilteredDoc(result.data.doctors);
      setIsLoading(false);
    } catch (error) {
      console.log("Error in filtering the data", error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilterDetails({
      rating: "",
      experience: "",
      gender: "",
    });
    searchQuerySetter("");
    setcurrDocState({ ...currDocState, isFiltered: false });

    ratingCardRef.current?.resetRadios();
    experienceCardRef.current?.resetRadios();
    genderCardRef.current?.resetRadios();

    setCurrPageNumber(1);
    setFilteredDoc(doctors);
    setTotalPages(initialPages);
  };

  return (
    <div className={styles.parent}>
      <div className={styles.hero}>
        <p className={styles.heading}>Find a doctor at your own ease</p>
        <SearchBar
          searchQuery={searchQuery}
          searchQuerySetter={searchQuerySetter}
          handleFilteredDocState={handleFilteredDocState}
          handleLoader={handleLoader}
        />
      </div>
      <div className={styles.doctorsSection}>
        <p className={styles.heading}>{totalDoctors} doctors available</p>
        <p className={styles.subheading}>
          Book appointments with minimum wait-time & verified doctor details
        </p>
        <div className={styles.sidebar}>
          <aside>
            <div className={styles.details}>
              {isLoading && <Loader />}
              <span>Filter By:</span>
              <span
                onClick={currDocState.isFiltered ? handleReset : handleFilter}
              >
                {currDocState.isFiltered ? "Reset" : "Apply"}
              </span>
            </div>
            <SideCard
              title="Rating"
              data={["1 star", "2 star", "3 star", "4 star", "5 star"]}
              handleFilter={handleFilterStates}
              ref={ratingCardRef}
            />
            <SideCard
              title="Experience"
              data={[
                "15+ years",
                "10-15 years",
                "5-10 years",
                "3-5 years",
                "1-3 years",
                "0-1 years",
              ]}
              handleFilter={handleFilterStates}
              ref={experienceCardRef}
            />
            <SideCard
              title="Gender"
              data={["Show All", "Male", "Female"]}
              handleFilter={handleFilterStates}
              ref={genderCardRef}
            />
          </aside>
          <>
            <DoctorsGrid
              doctors={
                currDocState.isFiltered || currDocState.isSearched
                  ? filteredDoc
                  : doctors
              }
            />
            {totalPages > 1 && (
              <PaginationControl
                totalPages={totalPages}
                currPage={currPageNumber}
                currPageSetter={currPageSetter}
              />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
