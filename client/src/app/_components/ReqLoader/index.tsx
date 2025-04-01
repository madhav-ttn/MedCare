import React from "react";
import styles from "./index.module.css";

export default function ReqLoader() {
  return (
    <span className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </span>
  );
}
