import { PrismicResultsObject } from '@/types/prismic-data';
export default function linkResolver(doc: PrismicResultsObject): string {
  if (doc.type === 'home') {
    return '/'
  }
  if (doc.type === 'page') {
    return '/page/' + doc.uid
  }

  return '/not-found'
}