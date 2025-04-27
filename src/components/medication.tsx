import { DateValue, Tab, Tabs } from '@heroui/react'
import { getLocalTimeZone } from '@internationalized/date'
import { useState } from 'react'
import type { MedicationItem } from '@Lib/api/MedicationService'

type MedicationProps = {
  medication: MedicationItem
  key: number
  date: DateValue
}

type MedicationAction = 'taken' | 'skipped'

const Medication: React.FC<MedicationProps> = ({ medication, date }) => {
  const defaultKey: MedicationAction = medication.taken ? 'taken' : 'skipped'
  const [selectedKey, setSelectedKey] = useState<string>(defaultKey)
  const dateString = date.toDate(getLocalTimeZone()).toLocaleDateString()

  const updateMedicationStatus = (status: MedicationAction) => {
    // This would call an API to update the medication status
    // or update local storage to track medication adherence
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`Updating medication ${medication.name} to ${status} on ${dateString}`)

    // TODO: Acctually implement this
    const key = `med-${medication.id}-${dateString}`
    localStorage.setItem(key, status)

    setSelectedKey(status)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Tabs
          aria-label="Medication Status"
          classNames={{ tabList: 'bg-content3' }}
          color={selectedKey === 'taken' ? 'success' : 'danger'}
          selectedKey={selectedKey}
          onSelectionChange={(val) => {
            const newStatus = val.toString() as MedicationAction
            updateMedicationStatus(newStatus)
          }}
        >
          <Tab key="taken" title="Taken">
            <div className="py-2">
              <p>Took on {dateString}</p>
              {medication.instructions && <p className="text-sm mt-2">Instructions: {medication.instructions}</p>}
            </div>
          </Tab>
          <Tab key="skipped" title="Skipped">
            <div className="py-2">
              <p>Skipped on {dateString}</p>
              {medication.instructions && <p className="text-sm mt-2">Instructions: {medication.instructions}</p>}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Medication
