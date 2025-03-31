import Image from "next/image";
import styles from "./page.module.css";
import RedirectLink from "./_components/RedirectLink";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.leftsection}>
          <div className={styles.innerContent}>
            <p className={styles.heading}>Health in Your Hands</p>
            <p className={styles.subheading}>
              Take control of your healthcare with CareMate. Book appointments
              with ease, explore health blogs, and stay on top of your
              well-being, all in one place.
            </p>
            <RedirectLink
              href="/appointments"
              className="startButton"
              label="Get Started"
            />
          </div>
        </div>
        <div className={styles.rightsection}>
          <Image
            src="/Mask.svg"
            alt="banner"
            className="bannerImage"
            width={100}
            height={100}
            layout="responsive"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}
