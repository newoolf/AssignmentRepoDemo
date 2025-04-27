import { useState, useEffect } from 'react'
import type Client from 'fhirclient/lib/Client'
import { processMedicationBundle } from '@Lib/helper/utility'
import { MedicationData } from '@/types'

export const useMedicationData = (fhirClient: Client | null, patientId?: string) => {
  const [medications, setMedications] = useState<MedicationData[]>([])
  const [medicationBundle, setMedicationBundle] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fhirClient || !patientId) return

    const fetchMedications = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch medication requests directly as a Bundle
        const medicationRequestBundle = await fhirClient.request(`MedicationRequest?subject=Patient/${patientId}`)

        // Store the raw bundle for use with database service
        setMedicationBundle(medicationRequestBundle)

        // Process medication data for display
        const processedMeds = processMedicationBundle(medicationRequestBundle)
        setMedications(processedMeds)
      } catch (err) {
        setError(`Failed to fetch medications: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [fhirClient, patientId])

  const addMedication = async (newMedication: any) => {
    if (!fhirClient || !patientId) {
      throw new Error('FHIR client is not initialized or patient ID not available.')
    }

    try {
      const response = await fhirClient.create({
        resource: newMedication
      })

      const newMedicationData = {
        id: response.id,
        name: newMedication.medicationCodeableConcept.text,
        dose: newMedication.dosageInstruction?.[0]?.text.split(',')[0] || '',
        frequency: newMedication.dosageInstruction?.[0]?.text.split(',')[1]?.trim() || '',
        instructions: newMedication.note?.[0]?.text || '',
        resource: response
      }

      setMedications([...medications, newMedicationData])

      const updatedBundle = await fhirClient.request(`MedicationRequest?subject=Patient/${patientId}`)
      setMedicationBundle(updatedBundle)

      return response
    } catch (err) {
      throw new Error(`Error creating medication: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const removeMedication = async (medicationId: string) => {
    if (!fhirClient) {
      throw new Error('FHIR client is not initialized')
    }

    try {
      // Delete the medication from the FHIR server
      await fhirClient.delete({ resourceType: 'MedicationRequest', id: medicationId })

      // Update the UI by filtering out the removed medication
      setMedications(medications.filter((med) => med.id !== medicationId))

      if (patientId) {
        const updatedBundle = await fhirClient.request(`MedicationRequest?subject=Patient/${patientId}`)
        setMedicationBundle(updatedBundle)
      }
    } catch (err) {
      throw new Error(`Error removing medication: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return {
    medications,
    medicationBundle,
    loading,
    error,
    addMedication,
    removeMedication
  }
}
