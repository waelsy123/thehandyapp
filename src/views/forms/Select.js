import React from 'react'
import { SelectInput } from './../../styles/forms'

export default class Select extends React.Component {
  render () {
    return (
      <SelectInput
        defaultValue={this.props.defaultValue}
        name={this.props.name}
        onChange={this.props.onChange}
      >
        {this.props.items.map(c => {
          return (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          )
        })}
      </SelectInput>
    )
  }
}
