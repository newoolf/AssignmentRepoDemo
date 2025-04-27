import { AccordionItem, DateValue } from '@heroui/react'
import { Accordion } from '@heroui/react'
import Medication from './medication'

type MedicationListProps = {
  date: DateValue
}

const MedicationList: React.FC<MedicationListProps> = ({ date }) => {
  const medications = [
    { name: 'Zyrtec', dose: '10mg', taken: false },
    { name: 'Wellbutrin', dose: '150mg', taken: true },
    { name: 'Adderall XR', dose: '25mg', taken: true },
    { name: 'Zoloft', dose: '75mg', taken: false }
  ] // useMedication? useMedicationStatement? w/ date somehow

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion variant="splitted">
        {medications.map((medication, index) => (
          <AccordionItem
            key={index}
            aria-label={`Medication ${medication.name} ${medication.dose}`}
            title={`${medication.name} ${medication.dose}`}
            className="bg-content2"
          >
            <Medication medication={medication} key={index} date={date} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default MedicationList
