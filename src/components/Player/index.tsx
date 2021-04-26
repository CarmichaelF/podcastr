import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from "../../context/PlayerContext";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../util/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    handlePlayNext,
    handlePlayPrevious,
    handleClearPlayerState,
    hasPrevious,
    hasNext
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current)
      return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying])

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const handleEpisodeEnded = () => {
    if(hasNext){
      handlePlayNext();
    }
    else{
      handleClearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.player}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {
        episode ? (
          <div className={styles["player-current"]}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover" />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>

          </div>
        )
          :
          (
            <div className={styles["player-empty"]}>
              <strong>Selecione um podcast para ouvir</strong>
            </div>
          )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles["player-progress"]}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles["player-slider"]}>
            {episode ?
              (<Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: "4px" }}
              />)
              :
              <div className={styles["player-slider__empty"]} />}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles["player-buttons"]}>
          <button
            onClick={toggleShuffle}
            className={isShuffling ? styles["active"] : ""}
            type="button"
            disabled={!episode || episodeList.length === 1}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button onClick={handlePlayPrevious} type="button" disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles["play-btn"]}
            disabled={!episode}
            onClick={togglePlay}
          >
            <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt="Tocar episódio" />
          </button>

          <button onClick={handlePlayNext} type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            className={isLooping ? styles["active"] : ""}
            type="button"
            disabled={!episode}
            onClick={toggleLoop}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>
    </div >
  )
}