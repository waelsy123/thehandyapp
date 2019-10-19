// lets users search posts using the Algolia API
// https://community.algolia.com/react-instantsearch/Getting_started.html#install-react-instantsearch
const MapPopupContent = ({ hit }) => {
  return `<strong>${hit.title}</strong><p>${hit.description}</p>`
}

export default MapPopupContent
