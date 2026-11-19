import { useCallback, useState } from 'react'
import { SearchBar } from '../features/search'
import { BookDetails, BookList, Toast, useBookSearch } from '../features/books'

function App() {
  const [query, setQuery] = useState('')
  const { status, results, error } = useBookSearch(query)
  const [selectedBook, setSelectedBook] = useState(null)
  const [dismissedError, setDismissedError] = useState(null)

  const dismissToast = useCallback(() => setDismissedError(error), [error])

  const handleSearchChange = useCallback((value) => {
    setQuery(value)
    setDismissedError(null)
  }, [])

  const closeDetails = useCallback(() => setSelectedBook(null), [])

  const toast =
    status === 'error' && dismissedError !== error
      ? { message: `Ошибка поиска: ${error}`, variant: 'danger' }
      : null

  return (
    <>
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand">Книжный поиск</span>
          <span className="navbar-text d-none d-md-inline">Поиск по Open Library</span>
        </div>
      </nav>

      <main className="container pb-5">
        <h1 className="visually-hidden">Поиск книг в Open Library</h1>
        <SearchBar value={query} onChange={handleSearchChange} disabled={status === 'loading'} />

        {status === 'idle' && (
          <p className="text-body-secondary text-center py-5 mb-0">
            Введите название книги - например, "Дюна" или "Harry Potter"
          </p>
        )}

        {status === 'loading' && (
          <div className="text-center py-5" aria-live="polite">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            <p className="mt-2 text-body-secondary">Идёт поиск…</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <BookList books={results} onSelect={setSelectedBook} />
        )}
      </main>

      {selectedBook && <BookDetails book={selectedBook} onClose={closeDetails} />}

      {toast && <Toast message={toast.message} variant={toast.variant} onDismiss={dismissToast} />}
    </>
  )
}

export default App
