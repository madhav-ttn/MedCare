"use client";
import Image from "next/image";
import styles from "./index.module.css";
import { useRef } from "react";
export default function SearchBar({
  searchQuery,
  searchQuerySetter,
  handleFilteredDocState,
  handleLoader,
}: {
  searchQuery: string;
  searchQuerySetter: (query: string) => void;
  handleFilteredDocState: (doc: string) => void;
  handleLoader: (state: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: any) => {
    try {
      if (inputRef && inputRef.current) {
        searchQuerySetter(inputRef.current.value);
        await handleFilteredDocState(inputRef.current.value);
      }
    } catch (error) {
      console.log("Error in searching the doctors", error);
      handleLoader(false);
    }
  };
  return (
    <div className={styles.searchSection}>
      <Image
        src={"/search.svg"}
        alt=""
        width={20}
        height={20}
        style={{ position: "absolute", top: "24px", left: "16px" }}
      />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        placeholder="Search Doctors"
        onChange={handleChange}
      />
      <button>Search</button>
    </div>
  );
}
