import styles from "./styles.module.scss";

export function Player() {

 return (
  <div className={styles.player}>
   <header>
    <img src="/playing.svg" alt="Tocando agora" />
    <strong>Tocando agora</strong>
   </header>

   <div className={styles["player-empty"]}>
    <strong>Selecione um podcast para ouvir</strong>
   </div>

   <footer className={styles.empty}>
    <div className={styles["player-progress"]}>
     <span>00:00</span>
     <div className={styles["player-slider"]}>
      <div className={styles["player-slider__empty"]} />
     </div>
     <span>00:00</span>
    </div>

    <div className={styles["player-buttons"]}>
     <button type="button">
      <img src="/shuffle.svg" alt="Embaralhar" />
     </button>
     <button type="button">
      <img src="/play-previous.svg" alt="Tocar anterior" />
     </button>

     <button type="button" className={styles["play-btn"]}>
      <img src="/play.svg" alt="Tocar" />
     </button>

     <button type="button">
      <img src="/play-next.svg" alt="Tocar próxima" />
     </button>
     <button type="button">
      <img src="/repeat.svg" alt="Repetir" />
     </button>

    </div>
   </footer>
  </div>
 )
}