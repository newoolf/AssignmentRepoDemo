import { DateValue, Tab, Tabs } from '@heroui/react'
import { getLocalTimeZone } from '@internationalized/date'
import { useState } from 'react'

type MedicationProps = {
  medication: TempMedication
  key: number
  date: DateValue
}

// TODO: Change to actual Medication type that's being used somewhere in the repo
export type TempMedication = {
  name: string
  dose: string
  taken: boolean
}

type MedicationAction = 'taken' | 'skipped'

const MedicationList: React.FC<MedicationProps> = ({ medication, date }) => {
  const defaultKey: MedicationAction = medication.taken ? 'taken' : 'skipped'
  const [selectedKey, setSelectedKey] = useState<string>(defaultKey)
  const dateString = date.toDate(getLocalTimeZone()).toLocaleDateString()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Tabs
          aria-label="Options"
          classNames={{ tabList: 'bg-content3' }}
          color={selectedKey === 'taken' ? 'success' : 'danger'}
          selectedKey={selectedKey}
          onSelectionChange={(val) => setSelectedKey(val.toString())}
        >
          <Tab key="taken" title="Taken">
            Took Medication on {dateString}
          </Tab>
          <Tab key="skipped" title="Skipped">
            Skipped Medication on {dateString}
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default MedicationList
