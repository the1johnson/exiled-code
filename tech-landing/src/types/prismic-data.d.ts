export interface PrismicResultsObject {
  id: string
  uid: string
  type: string;
  href: string
  tags: string[]
  first_publication_date: string
  last_publication_date: string
  slugs: string[]
  lang: string
  alternate_languages: []
  data: []
}

export interface PrismicApiResponseObject {
  page: number
  results_per_page: number
  results_size: number
  total_results_size: number
  total_pages: number
  next_page: string | null
  prev_page: string | null
  results: PrismicResultsObject[]
  version?: string
  license?: string
}

interface PrismicTextObject {
  type: string
  text: string
  spans: []
}

interface PrismicLinkObject {
  link_type: string
  url: string
  target: string
}

interface PrismicImageObject {
  dimensions: {
    width: number,
    height: number,
  }
  alt?: string
  copyright?: string
  url: string
}