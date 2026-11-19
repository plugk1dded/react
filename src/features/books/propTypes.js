import PropTypes from 'prop-types'

export const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.string.isRequired,
  year: PropTypes.number,
  coverUrl: PropTypes.string.isRequired,
  hasCover: PropTypes.bool.isRequired,
})

export const detailsShape = PropTypes.shape({
  description: PropTypes.string,
  subjects: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  coverUrl: PropTypes.string.isRequired,
})

export const ratingsShape = PropTypes.shape({
  average: PropTypes.number,
  count: PropTypes.number.isRequired,
})
