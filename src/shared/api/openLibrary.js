const SEARCH_URL = 'https://openlibrary.org/search.json'
const COVERS_URL = 'https://covers.openlibrary.org'
const WORKS_URL = 'https://openlibrary.org/works'

const EMPTY_COVER_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192">' +
      '<rect width="100%" height="100%" fill="#e9ecef"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="sans-serif" font-size="14" fill="#6c757d">Нет обложки</text>' +
      '</svg>'
  )

function buildCoverUrl(coverId, size = 'M') {
  if (!coverId) return EMPTY_COVER_URL
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`
}

function normalizeSearchDoc(doc) {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title ?? 'Без названия',
    authors: doc.author_name?.length > 0 ? doc.author_name.join(', ') : 'Автор неизвестен',
    year: doc.first_publish_year ?? null,
    coverUrl: buildCoverUrl(doc.cover_i, 'M'),
    hasCover: Boolean(doc.cover_i),
  }
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Запрос к Open Library завершился с кодом ${response.status}`)
  }
  return response.json()
}

export async function searchBooks(query, signal) {
  const params = new URLSearchParams({ q: query, limit: '12' })
  const data = await fetchJson(`${SEARCH_URL}?${params}`, signal)
  return data.docs.map(normalizeSearchDoc)
}

function normalizeDescription(description) {
  if (!description) return null
  if (typeof description === 'string') return description
  if (typeof description.value === 'string') return description.value
  return null
}

export async function fetchWorkDetails(workId, signal) {
  const data = await fetchJson(`${WORKS_URL}/${workId}.json`, signal)

  return {
    description: normalizeDescription(data.description),
    subjects: data.subjects?.slice(0, 12) ?? [],
    coverUrl: buildCoverUrl(data.covers?.find((id) => id > 0), 'L'),
  }
}

export async function fetchRatings(workId, signal) {
  const data = await fetchJson(`${WORKS_URL}/${workId}/ratings.json`, signal)
  return {
    average: data.summary?.average ?? null,
    count: data.summary?.count ?? 0,
  }
}
