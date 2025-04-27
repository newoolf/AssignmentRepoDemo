import { AccordionItem, DateValue } from '@heroui/react'
import { Accordion } from '@heroui/react'
import Medication from './medication'
import { useMedications, MedicationItem } from '@Lib/api/MedicationService'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'

type MedicationListProps = {
  date: DateValue
}

const MedicationList: React.FC<MedicationListProps> = ({ date }) => {
  const { client: fhirClient, isLoading: clientLoading } = useFhirClient()
  const { medications, error, loading } = useMedications(fhirClient, date)

  if (clientLoading) return <div className="w-full">Initializing FHIR client...</div>
  if (loading) return <div className="w-full">Loading medications...</div>
  if (error) return <div className="w-full">Error loading medications: {error}</div>
  if (medications.length === 0) return <div className="w-full">No medications found for this date</div>

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion variant="splitted">
        {medications.map((medication, index) => (
          <AccordionItem
            key={medication.id}
            aria-label={`Medication ${medication.name} ${medication.dose}`}
            title={`${medication.name} ${medication.dose}`}
            subtitle={medication.frequency}
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
