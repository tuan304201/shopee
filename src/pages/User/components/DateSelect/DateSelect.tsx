import { range } from 'lodash'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDay() || 1,
    month: value?.getMonth() || 1,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFormSelect, name } = event.target
    const newDate = {
      date: value?.getDay() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFormSelect)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-6 flex'>
      <div className='mt-3 min-w-[6rem]'>Ngày sinh</div>
      <div>
        <div>
          <select
            onChange={handleChange}
            name='date'
            value={value?.getDate() || date.date}
            className='w-full cursor-pointer rounded border border-gray-300 p-3 outline-none hover:border-orange focus:border-gray-400 sm:w-20'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            value={value?.getMonth() || date.month}
            className='my-4 w-full cursor-pointer rounded border border-gray-300 p-3 outline-none hover:border-orange focus:border-gray-400 sm:my-0 sm:mx-4 sm:w-20'
          >
            <option disabled>Tháng</option>
            {range(1, 13).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            value={value?.getFullYear() || date.year}
            className='w-full cursor-pointer rounded border border-gray-300 p-3 outline-none hover:border-orange focus:border-gray-400 sm:w-20'
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
