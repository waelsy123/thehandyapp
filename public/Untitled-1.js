export default class Search extends React.Component {
 constructor (props) {
  super(props)
  this.state = { searchQuery: props.searchQuery }
 }
 
setSearchQuery = debounce((e) => {
  this.setState({ searchQuery: e.target.value })
 }, 1000)
render() {
  return (
   <div>
    <p>{this.state.searchQuery}</p>
    <input type="search" onChange={this.setSearchQuery} />
   </div>
  )
 }
}
