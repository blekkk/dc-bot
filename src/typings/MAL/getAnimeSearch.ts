import { DayMonthYear, Image, JikanBasicInfo, Pagination } from "./JikanBasic";

export interface Anime {
  mal_id: number,
  url: string,
  images: {
    jpg: Image,
    webp: Image,
  },
  title: string,
  title_english: string,
  title_japanese: string,
  title_synonim: string[],
  trailer: {
    youtube_id: string,
    url: string,
    embed_url: string
  },
  type: string,
  source: string,
  episodes: number,
  status: string,
  airing: boolean,
  aired: {
    from: string,
    to: string,
    prop: {
      from: DayMonthYear,
      to: DayMonthYear,
      string: string,
    },
  },
  duration: string,
  rating: string,
  score: number,
  scored_by: number,
  rank: number,
  popularity: number,
  members: number,
  favorites: number,
  synopsis: string,
  background: string,
  season: string,
  year: number,
  broadcast: JikanBasicInfo[],
  producers: JikanBasicInfo[],
  licensors: JikanBasicInfo[],
  studios: JikanBasicInfo[],
  genres: JikanBasicInfo[],
  serializations: JikanBasicInfo[],
  explicit_genres: JikanBasicInfo[],
  themes: JikanBasicInfo[],
  demographics: JikanBasicInfo[],
}

export interface AnimeSearch {
  data: Anime[],
  pagination: Pagination
}