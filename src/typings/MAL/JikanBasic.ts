export interface Image {
  image_url: string,
  small_image_url: string,
  large_image_url: string,
}

export interface DayMonthYear {
  day: number,
  month: number,
  year: number,
}

export interface JikanBasicInfo {
  mal_id: number,
  type: string,
  name: string,
  url: string,
}

export interface Pagination {
  last_visible_page: number,
  has_next_page: boolean
}