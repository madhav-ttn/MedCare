import styles from "./index.module.css";

export default function PageLoader() {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
