import PropTypes from 'prop-types'
import BookCard from './BookCard.jsx'
import { bookShape } from '../propTypes.js'

function BookList(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(BookList.propTypes, props, 'prop', 'BookList')
  }

  const { books, onSelect } = props

  if (books.length === 0) {
    return (
      <p className="text-body-secondary text-center py-5 mb-0">
        Книги не найдены — попробуйте другой запрос
      </p>
    )
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
      {books.map((book) => (
        <div className="col" key={book.id}>
          <BookCard book={book} onSelect={onSelect} />
        </div>
      ))}
    </div>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape.isRequired).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default BookList
