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

  // Add function to update medication status
  const updateMedicationStatus = (status: MedicationAction) => {
    // This would call an API to update the medication status
    // or update local storage to track medication adherence
    console.log(`Updating medication ${medication.name} to ${status} on ${dateString}`)

    // Example of how you might track this locally
    const key = `med-${medication.id}-${dateString}`
    localStorage.setItem(key, status)

    // Update UI state
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
            <div className="p-2">
              <p>
                Took {medication.name} {medication.dose} on {dateString}
              </p>
              {medication.instructions && <p className="text-sm mt-2">Instructions: {medication.instructions}</p>}
            </div>
          </Tab>
          <Tab key="skipped" title="Skipped">
            <div className="p-2">
              <p>
                Skipped {medication.name} {medication.dose} on {dateString}
              </p>
              {medication.instructions && <p className="text-sm mt-2">Instructions: {medication.instructions}</p>}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Medication
