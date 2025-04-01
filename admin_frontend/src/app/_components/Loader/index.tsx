import React from "react";
import styles from "./index.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}
