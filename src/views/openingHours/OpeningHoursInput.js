import React from 'react'
import { Button, Checkbox, TimePicker } from 'antd'
import * as _ from 'lodash'
import moment from 'moment'

const format = 'HH:mm'

export const defaultWeekDays = [
  { dayName: 'monday', opened: true, value: [{ from: 900, to: 1800 }] },
  {
    dayName: 'tuesday',
    opened: true,
    value: [{ from: 900, to: 1800 }]
  },
  {
    dayName: 'wednesday',
    opened: true,
    value: [{ from: 900, to: 1800 }]
  },
  {
    dayName: 'thursday',
    opened: true,
    value: [{ from: 900, to: 1800 }]
  },
  { dayName: 'friday', opened: true, value: [{ from: 900, to: 1800 }] },
  { dayName: 'saturday', opened: false, value: [{ from: 900, to: 1800 }] },
  { dayName: 'sunday', opened: false, value: [{ from: 900, to: 1800 }] }
]

export const getTimeStringFromNumber = value => {
  let str = value.toString()
  str = str.length === 3 ? `0${str}` : str

  return `${str.slice(0, 2)}:${str.slice(2, 4)}`
}

const getNumberTimeFromString = str => {
  return Number(`${str.slice(0, 2)}${str.slice(3, 5)}`)
}

class OpeningHoursDay extends React.Component {
  state = {
    opened: this.props.opened,
    value: this.props.value
  }

  onChangeCheckbox = e => {
    this.setState({
      opened: e.target.checked
    })
    this.props.onUpdateDay(this.state.value, e.target.checked)
  }

  addRow = () => {
    const { value } = this.state

    value.push({ from: 900, to: 1800 })

    this.setState({
      value,
      opened: true
    })

    this.props.onUpdateDay(this.state.value, this.state.opened)
  }

  deleteRow = index => {
    const { value } = this.state

    value.splice(index, 1)
    this.setState({
      value,
      opened: value.length > 0
    })
    this.props.onUpdateDay(this.state.value, this.state.opened)
  }

  onChangeFrom = (time, timeString, index) => {
    const { value } = this.state

    value[index].from = getNumberTimeFromString(timeString)
    this.setState({
      value
    })
    this.props.onUpdateDay(this.state.value, this.state.opened)
  }

  onChangeTo = (time, timeString, index) => {
    const { value } = this.state

    value[index].to = getNumberTimeFromString(timeString)
    this.setState({
      value
    })
    this.props.onUpdateDay(this.state.value, this.state.opened)
  }

  render () {
    const { dayName } = this.props
    const { opened, value } = this.state

    return (
      <div className='opening-hours-day-container'>
        <div className='day-checkbox-container'>
          <Checkbox
            checked={opened}
            onChange={this.onChangeCheckbox}
            defaultChecked={opened}
          />
          <div className={'day-name ' + (opened && 'bold')}>
            {dayName[0].toUpperCase() + dayName.slice(1)}
          </div>
        </div>
        <div className='time-selectors-container'>
          {opened ? (
            value &&
            value.map((row, index) => (
              <div key={Math.random()} className='time-selectors-row'>
                <div className='from'>
                  <TimePicker
                    defaultValue={moment(
                      getTimeStringFromNumber(row.from),
                      format
                    )}
                    onChange={(time, timeString) => {
                      this.onChangeFrom(time, timeString, index)
                    }}
                    format={format}
                  />
                </div>
                <div className='seperator'>-</div>
                <div className='to'>
                  <TimePicker
                    defaultValue={moment(
                      getTimeStringFromNumber(row.to),
                      format
                    )}
                    onChange={(time, timeString) => {
                      this.onChangeTo(time, timeString, index)
                    }}
                    format={format}
                  />
                </div>
                <div className='delete-row-container'>
                  <Button
                    onClick={() => {
                      this.deleteRow(index)
                    }}
                    type='link'
                  >
                    X
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className='closed-label'>closed</div>
          )}

          {opened && (
            <div className='add-row-container'>
              <Button onClick={this.addRow} type='link'>
                + Add
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default class OpeningHoursInput extends React.Component {
  state = {
    value: this.props.defaultValue || defaultWeekDays
  }

  onUpdateDay = (dayName, dayValue, opened) => {
    const { value } = this.state

    const newValue = value.map(day => {
      if (day.dayName === dayName) {
        day.value = dayValue
        day.opened = opened
      }

      return day
    })

    this.setState({
      value: newValue
    })

    this.props.onChange(newValue)
  }

  render () {
    const { value } = this.state

    return (
      <div>
        {value.map(day => (
          <OpeningHoursDay
            key={day.dayName}
            dayName={day.dayName}
            opened={day.opened}
            value={day.value}
            onUpdateDay={(dayValue, opened) => {
              this.onUpdateDay(day.dayName, dayValue, opened)
            }}
          />
        ))}
      </div>
    )
  }
}
