'use client'
import { Card, CardBody, DateValue, Calendar } from '@heroui/react'
import { getLocalTimeZone, today } from '@internationalized/date'
import { useState } from 'react'
import MedicationList from './medication-list'

const MedicationManagementCard: React.FC = () => {
  const defaultDate = today(getLocalTimeZone())
  const [date, setDate] = useState<DateValue>(defaultDate as unknown as DateValue)
  // TODO: Fetch data whenever the date changes
  const handleDateChange = () => {}

  return (
    <Card className="w-full p-2">
      <CardBody className="">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold">Medication Management</h1>
        {/* Calendar */}
        <div className="flex gap-4 mt-4">
          <div className="w-full flex-1">
            <Calendar //
              classNames={{ headerWrapper: 'bg-content2', gridHeader: 'bg-content2' }}
              value={date}
              onChange={setDate}
              onFocusChange={setDate}
              showMonthAndYearPickers={false}
              aria-label="Date (Show Month and Year Picker)"
            />
          </div>
          <MedicationList date={date} />
        </div>
      </CardBody>
    </Card>
  )
}

export default MedicationManagementCard
