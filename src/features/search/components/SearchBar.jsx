import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function SearchBar(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(SearchBar.propTypes, props, 'prop', 'SearchBar')
  }

  const { value, onChange, disabled } = props
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleClear() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <form
      className="row g-2 mb-4"
      onSubmit={(event) => {
        event.preventDefault()
        inputRef.current?.blur()
      }}
      role="search"
    >
      <div className="col">
        <label htmlFor="book-search" className="form-label visually-hidden">
          Поиск книг по названию
        </label>
        <input
          id="book-search"
          ref={inputRef}
          type="text"
          className="form-control form-control-lg"
          placeholder="Введите название книги…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="col-auto d-flex align-items-end gap-2">
        {value !== '' && (
          <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
            Очистить
          </button>
        )}
        {disabled && (
          <span className="spinner-border spinner-border-sm text-secondary mb-2" aria-hidden="true" />
        )}
      </div>
    </form>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default SearchBar
