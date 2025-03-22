import styles from "./index.module.css";
import { SideCardProps } from "@/types/types";
import { forwardRef, useImperativeHandle, useRef } from "react";

const SideCard = forwardRef<{ resetRadios: () => void }, SideCardProps>((props, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  
  useImperativeHandle(ref, () => ({
    resetRadios: () => {
      if (formRef.current) {
        const radioInputs = formRef.current.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
          (input as HTMLInputElement).checked = false;
        });
      }
    }
  }));
  
  return (
    <form className={styles.card} ref={formRef}>
      <p>{props.title}</p>
      {props.data.map((item: string, index: number) => (
        <div className={styles.item} key={`${props.title}-${index}`}>
          <input 
            type="radio" 
            id={`${props.title}-${item}`} 
            name={props.title} 
            value={item}
            onChange={() => props.handleFilter(props.title.toLowerCase(), item)}
          />
          <label htmlFor={`${props.title}-${item}`}>{item}</label>
        </div>
      ))}
    </form>
  );
});


export default SideCard;