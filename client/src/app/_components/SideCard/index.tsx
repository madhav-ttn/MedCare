import styles from "./index.module.css";
export default function SideCard(props:any){
    return(
        <div className={styles.card}>
            <p>{props.title}</p>
            {props.data.map((item:any)=>
                <div className={styles.item} key={item.id}>
                  <input type="radio" id="vehicle1" name="vehicle1" />
                  <label htmlFor="vehicle1">{item}</label>
                </div>
            )}
        </div>
    )
}