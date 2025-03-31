import styles from "./index.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
