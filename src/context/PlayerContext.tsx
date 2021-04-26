import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
 title: string;
 members: string;
 thumbnail: string;
 duration: number;
 url: string;
}

type PlayerContextData = {
 episodeList: Array<Episode>;
 currentEpisodeIndex: number;
 isPlaying: boolean;
 isLooping: boolean;
 isShuffling: boolean;
 handlePlay: (episode: Episode) => void;
 handlePlayPrevious: () => void;
 handlePlayNext: () => void;
 handlePlayList: (list: Array<Episode>, index: number) => void;
 handleClearPlayerState: () => void;
 togglePlay: () => void;
 toggleLoop: () => void;
 toggleShuffle: () => void;
 setPlayingState: (state: boolean) => void;
 hasPrevious: boolean;
 hasNext: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
 children: ReactNode
}

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
 const { Provider } = PlayerContext;
 const [episodeList, setEpisodeList] = useState([]);
 const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);
 const [isLooping, setIsLooping] = useState(false);
 const [isShuffling, setIsShuffling] = useState(false);

 const handlePlay = (episode) => {
  setEpisodeList([episode]);
  setCurrentEpisodeIndex(0);
  setIsPlaying(true);
 }

 const handlePlayList = (list: Array<Episode>, index: number) => {
  setEpisodeList(list);
  setCurrentEpisodeIndex(index);
  setIsPlaying(true);
 }

 const togglePlay = () => {
  setIsPlaying(!isPlaying);
 }

 const toggleLoop = () => {
  setIsLooping(!isLooping);
 }

 const toggleShuffle = () => {
  setIsShuffling(!isShuffling);
 }

 const setPlayingState = (state: boolean) => {
  setIsPlaying(state);
 }

 const hasPrevious = currentEpisodeIndex > 0;
 const previousEpisode = currentEpisodeIndex - 1;
 const nextEpisode = currentEpisodeIndex + 1;
 const hasNext = isShuffling || nextEpisode < episodeList.length;

 const handlePlayPrevious = () => {
  if (hasPrevious)
   setCurrentEpisodeIndex(previousEpisode);
 }

 const handlePlayNext = () => {
  if (isShuffling) {
   const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
   setCurrentEpisodeIndex(nextRandomEpisodeIndex);
  }
  else if (hasNext) {
   setCurrentEpisodeIndex(nextEpisode);
  }
 }

 const handleClearPlayerState = () =>{
   setEpisodeList([]);
   setCurrentEpisodeIndex(0);
 }

 return (
  <Provider value={{
   episodeList,
   currentEpisodeIndex,
   isPlaying,
   isLooping,
   isShuffling,
   handlePlay,
   handlePlayPrevious,
   handlePlayNext,
   handlePlayList,
   handleClearPlayerState,
   togglePlay,
   toggleLoop,
   toggleShuffle,
   setPlayingState,
   hasPrevious,
   hasNext
  }}>
   {children}
  </Provider>
 );
}

export const usePlayer = () => {
 return useContext(PlayerContext);
}