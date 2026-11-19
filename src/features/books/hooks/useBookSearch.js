import { useEffect, useState } from 'react'
import { searchBooks } from '../../../shared/api/openLibrary.js'

const DEBOUNCE_MS = 500

const IDLE_STATE = { status: 'idle', results: [], error: null }

export function useBookSearch(query) {
  const trimmed = query.trim()
  const [data, setData] = useState({ query: '', ...IDLE_STATE })

  useEffect(() => {
    if (trimmed === '') return

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        const results = await searchBooks(trimmed, controller.signal)
        setData({ query: trimmed, status: 'success', results, error: null })
      } catch (error) {
        if (error.name === 'AbortError') return
        setData({
          query: trimmed,
          status: 'error',
          results: [],
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        })
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed])

  if (trimmed === '') return IDLE_STATE
  if (data.query !== trimmed) return { status: 'loading', results: [], error: null }
  return data
}
