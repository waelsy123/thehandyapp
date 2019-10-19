import React from 'react'
import { Button, Checkbox, TimePicker } from 'antd'
import * as _ from 'lodash'
import { getTimeStringFromNumber } from './OpeningHoursInput'

export default class OpeningHours extends React.Component {
  render () {
    const { value } = this.props

    if (!value) {
      return 'old profile, edit profile to update opening hours'
    }

    let days = value.map(day => {
      day.dayName = day.dayName[0].toUpperCase() + day.dayName.slice(1)
      return day
    })

    let groupedDays = []
    let firstItemInGroup = days[0]
    let i = 1

    while (i < days.length) {
      if (
        _.isEqual(days[i].value, firstItemInGroup.value) &&
        days[i].opened === firstItemInGroup.opened
      ) {
        if (i === days.length - 1) {
          let newGroup = days[i]
          if (firstItemInGroup.dayName !== days[i].dayName) {
            newGroup.dayName = `${firstItemInGroup.dayName} - ${
              days[i].dayName
            }`
          }
          groupedDays.push(newGroup)
        }
        i++
        continue
      } else {
        let newGroup = days[i - 1]
        if (firstItemInGroup.dayName !== days[i - 1].dayName) {
          newGroup.dayName = `${firstItemInGroup.dayName} - ${
            days[i - 1].dayName
          }`
        }
        groupedDays.push(newGroup)
        firstItemInGroup = days[i]
      }
    }

    console.log(groupedDays)

    return (
      <div className='opening-hours'>
        {groupedDays.map(day => (
          <div key={day.dayName} className='day-group'>
            <div className='day-name'> {day.dayName}</div>
            {day.opened ? (
              <div className='day-times'>
                {day.value &&
                  day.value.map((time, rowIndex) => (
                    <div className='row' key={rowIndex}>
                      {getTimeStringFromNumber(time.from)} {' - '}
                      {getTimeStringFromNumber(time.to)}
                    </div>
                  ))}
              </div>
            ) : (
              <div className='day-times closed'>closed</div>
            )}
          </div>
        ))}
      </div>
    )
  }
}
