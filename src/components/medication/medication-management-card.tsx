'use client'
import { Card, CardBody, DateValue, Calendar } from '@heroui/react'
import { getLocalTimeZone, today } from '@internationalized/date'
import React, { useState } from 'react'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { Accordion, AccordionItem } from '@heroui/react'
import Medication from './medication'
import { MedicationData } from '@/types'

const MedicationManagementCard: React.FC = () => {
  const defaultDate = today(getLocalTimeZone())
  const [date, setDate] = useState<DateValue>(defaultDate as unknown as DateValue)
  const { client: fhirClient, isLoading } = useFhirClient()
  const [medications, setMedications] = useState<MedicationData[]>([])
  const [loadingMeds, setLoadingMeds] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (!fhirClient || !date) return

    const fetchMedications = async () => {
      setLoadingMeds(true)
      setError(null)

      try {
        // First check if we have a valid patient context
        let patientId: string | null = null

        try {
          // Try to get patient ID from client
          const patientContext = await fhirClient.patient.read()
          patientId = patientContext.id
        } catch (patientErr) {
          // If can't get patient context, try to get from current user
          try {
            const user = await fhirClient.user.read()
            patientId = user.id
          } catch (userErr) {
            throw new Error('Patient context not available.')
          }
        }

        // If we have a patient ID, proceed with fetching medications
        if (!patientId) {
          throw new Error('Could not determine patient ID')
        }

        const medicationRequestBundle = await fhirClient.request(`MedicationRequest?subject=Patient/${patientId}`)

        // Process medication data for display
        const processedMeds: MedicationData[] = []
        medicationRequestBundle.entry?.forEach((entry: any) => {
          const resource = entry.resource
          let name = 'Unknown Medication'
          let dose = 'as directed'
          let instructions = ''
          let frequency = ''

          if (resource.medicationCodeableConcept?.coding?.[0]?.display) {
            name = resource.medicationCodeableConcept.coding[0].display
          } else if (resource.medicationCodeableConcept?.text) {
            name = resource.medicationCodeableConcept.text
          } else if (resource.medicationReference?.display) {
            name = resource.medicationReference.display
          }

          const dosageInstruction = resource.dosageInstruction?.[0]
          if (dosageInstruction?.doseAndRate?.[0]?.doseQuantity) {
            const dq = dosageInstruction.doseAndRate[0].doseQuantity
            dose = `${dq.value}${dq.unit || ''}`
          } else if (dosageInstruction?.text) {
            dose = dosageInstruction.text
          }

          if (dosageInstruction?.timing?.code?.text) {
            frequency = dosageInstruction.timing.code.text
          }

          instructions = dosageInstruction?.patientInstruction || ''

          const dateString = date.toDate(getLocalTimeZone()).toLocaleDateString()
          const key = `med-${resource.id}-${dateString}`
          const status = localStorage.getItem(key)
          const taken = status === 'taken'

          processedMeds.push({
            id: resource.id,
            name,
            dose,
            frequency,
            instructions,
            taken,
            resource
          })
        })

        setMedications(processedMeds)
      } catch (err) {
        setError(`Failed to fetch medications: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoadingMeds(false)
      }
    }

    fetchMedications()
  }, [fhirClient, date])

  return (
    <Card className="w-full p-2">
      <CardBody>
        <h1 className="text-3xl md:text-4xl font-bold">Medication Management</h1>
        <div className="flex gap-4 mt-4">
          <div className="w-full flex-1">
            <Calendar
              classNames={{ headerWrapper: 'bg-content2', gridHeader: 'bg-content2' }}
              value={date}
              onChange={setDate}
              onFocusChange={setDate}
              showMonthAndYearPickers={false}
              aria-label="Date (Show Month and Year Picker)"
            />
          </div>
          <div className="">
            {isLoading || loadingMeds ? (
              <div className="w-full flex justify-center items-center">
                <p>Loading medications...</p>
              </div>
            ) : error ? (
              <div className="w-full flex justify-center items-center">
                <p className="text-danger">{error}</p>
              </div>
            ) : medications.length === 0 ? (
              <div className="w-full flex justify-center items-center">
                <p>No medications found for this date</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default MedicationManagementCard
