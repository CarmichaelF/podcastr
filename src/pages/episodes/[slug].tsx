import { parseISO } from 'date-fns';
import Link from 'next/link';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import Image from 'next/image';
import { convertDurationToTimeString } from '../../util/convertDurationToTimeString';

import styles from "./episode.module.scss";

type Episode = {
 id: string;
 title: string;
 thumbnail: string;
 members: string;
 publishedAt: string;
 durationAsString: string;
 duration: number;
 url: string;
 description: string;
}

type EpisodeProps = {
 episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
 return (
  <div className={styles.episode}>
   <div className={styles["episode-thumbnail"]}>
    <Link href="/">
     <button type="button">
      <img src="/arrow-left.svg" alt="Voltar" />
     </button>
    </Link>
    <Image
     width={700}
     height={160}
     src={episode.thumbnail}
     objectFit="cover" />
    <button type="button">
     <img src="/play.svg" alt="Tocar episódio" />
    </button>
   </div>

   <header>
    <h1>{episode.title}</h1>
    <span>{episode.members}</span>
    <span>{episode.publishedAt}</span>
    <span>{episode.durationAsString}</span>
   </header>

   <div
    className={styles["episode-description"]}
    dangerouslySetInnerHTML={{ __html: episode.description }} />
  </div>
 );
}

export const getStaticPaths: GetStaticPaths = async () => {
 return {
  paths: [],
  fallback: "blocking"
 }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
 const { slug } = ctx.params;

 const { data } = await api.get(`episodes/${slug}`);

 const duration = Number(data.file.duration);

 const episode = {
  id: data.id,
  title: data.title,
  thumbnail: data.thumbnail,
  members: data.members,
  publishedAt: format(parseISO(data.published_at), "d MMM yy", { locale: ptBR }),
  durationAsString: convertDurationToTimeString(duration),
  duration: duration,
  description: data.description,
  url: data.file.url
 }

 return {
  props: { episode },
  revalidate: 60 * 60 * 24
 };
}