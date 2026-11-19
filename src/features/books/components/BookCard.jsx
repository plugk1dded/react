import { memo } from 'react'
import PropTypes from 'prop-types'
import { bookShape } from '../propTypes.js'

function BookCard(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(BookCard.propTypes, props, 'prop', 'BookCard')
  }

  const { book, onSelect } = props

  return (
    <div className="card h-100 book-card">
      <img
        src={book.coverUrl}
        className="card-img-top book-card__cover"
        alt={book.hasCover ? `Обложка: ${book.title}` : 'Обложка отсутствует'}
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="card-subtitle text-body-secondary small mb-1" title={book.authors}>
          {book.authors}
        </p>
        {book.year !== null && (
          <p className="card-text small text-body-secondary mb-3">Год: {book.year}</p>
        )}
        <button
          type="button"
          className="btn btn-primary btn-sm mt-auto align-self-start"
          onClick={() => onSelect(book)}
        >
          Подробнее
        </button>
      </div>
    </div>
  )
}

BookCard.propTypes = {
  book: bookShape.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default memo(BookCard)
