import Link from 'next/link';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { api } from '../services/api';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../util/convertDurationToTimeString';

import styles from "./home.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  durationAsString: string;
  duration: number;
  url: string;
}

type HomeProps = {
  episodes: Array<Episode>;
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.home}>
      <section className={styles["home-episodes__latest"]}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((ep) => {
            return (
              <li key={ep.id}>
                <Image
                  width={192}
                  height={192}
                  src={ep.thumbnail}
                  alt={ep.title}
                  objectFit="cover" />
                <div className={styles["home-episodes__detail"]}>
                  <Link href={`/episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles["home-episodes__all"]}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(ep => {
              return (<tr key={ep.id}>
                <td className={styles["thumb"]}>
                  <Image
                    width={120}
                    height={120}
                    src={ep.thumbnail}
                    alt={ep.title}
                    objectFit="cover" />
                </td>
                <td>
                  <Link href={`/episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                </td>
                <td>{ep.members}</td>
                <td className={styles["published-at"]}>{ep.publishedAt}</td>
                <td>{ep.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button></td>
              </tr>);
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  });


  const episodes = data.map(episode => {
    const duration = Number(episode.file.duration);
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", { locale: ptBR }),
      durationAsString: convertDurationToTimeString(duration),
      duration: duration,
      url: episode.file.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      episodes,
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}