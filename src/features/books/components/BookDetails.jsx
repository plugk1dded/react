import { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchRatings, fetchWorkDetails } from '../../../shared/api/openLibrary.js'
import { bookShape } from '../propTypes.js'

function renderStars(average) {
  const fullStars = Math.round(average)
  return (
    <span className="text-warning" title={`${average.toFixed(1)} из 5`} aria-hidden="true">
      {'★'.repeat(fullStars)}
      <span className="text-body-tertiary">{'★'.repeat(5 - fullStars)}</span>
    </span>
  )
}

class BookDetails extends Component {
  constructor(props) {
    super(props)
    if (import.meta.env.DEV) {
      PropTypes.checkPropTypes(BookDetails.propTypes, props, 'prop', 'BookDetails')
    }
    this.state = {
      details: null,
      ratings: null,
      status: 'loading',
      error: null,
    }
    this.controller = new AbortController()
  }

  componentDidMount() {
    const { book } = this.props
    const { signal } = this.controller

    Promise.all([fetchWorkDetails(book.id, signal), fetchRatings(book.id, signal)])
      .then(([details, ratings]) => {
        this.setState({ details, ratings, status: 'ready', error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        this.setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Не удалось загрузить данные',
        })
      })
  }

  componentWillUnmount() {
    this.controller.abort()
  }

  render() {
    const { book, onClose } = this.props
    const { details, ratings, status, error } = this.state

    return (
      <>
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">{book.title}</h2>
                <button type="button" className="btn-close" aria-label="Закрыть" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-4">
                    <img
                      src={details?.coverUrl ?? book.coverUrl}
                      className="img-fluid rounded book-details__cover"
                      alt={book.hasCover ? `Обложка: ${book.title}` : 'Обложка отсутствует'}
                    />
                  </div>
                  <div className="col-md-8">
                    <dl className="row">
                      <dt className="col-sm-4">Автор</dt>
                      <dd className="col-sm-8">{book.authors}</dd>

                      {book.year !== null && (
                        <>
                          <dt className="col-sm-4">Первое издание</dt>
                          <dd className="col-sm-8">{book.year}</dd>
                        </>
                      )}

                      <dt className="col-sm-4">Рейтинг</dt>
                      <dd className="col-sm-8">
                        {status === 'loading' && (
                          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                        )}
                        {status === 'ready' &&
                          (ratings.average === null ? (
                            'Нет оценок'
                          ) : (
                            <>
                              {renderStars(ratings.average)}{' '}
                              <span className="text-body-secondary">
                                {ratings.average.toFixed(1)} / 5 · оценок: {ratings.count}
                              </span>
                            </>
                          ))}
                        {status === 'error' && <span className="text-danger">{error}</span>}
                      </dd>
                    </dl>

                    {status === 'ready' && details.subjects.length > 0 && (
                      <>
                        <h3 className="h6 mt-4">Жанры и темы</h3>
                        <p>
                          {details.subjects.map((subject) => (
                            <span className="badge text-bg-secondary me-1 mb-1" key={subject}>
                              {subject}
                            </span>
                          ))}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="h6 mt-4">Описание</h3>
                {status === 'loading' && (
                  <p className="placeholder-glow" aria-label="Загрузка описания">
                    <span className="placeholder col-10 d-block" />
                    <span className="placeholder col-9 d-block" />
                    <span className="placeholder col-7 d-block" />
                  </p>
                )}
                {status === 'ready' &&
                  (details.description ? (
                    <p className="book-details__description">{details.description}</p>
                  ) : (
                    <p className="text-body-secondary">Описание отсутствует</p>
                  ))}
              </div>
              <div className="modal-footer">
                <a
                  className="btn btn-outline-secondary"
                  href={`https://openlibrary.org/works/${book.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть в Open Library
                </a>
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" onClick={onClose} />
      </>
    )
  }
}

BookDetails.propTypes = {
  book: bookShape.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default BookDetails
