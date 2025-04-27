import type Client from 'fhirclient/lib/Client'
import type { fhirclient } from 'fhirclient/lib/types'
import { useEffect, useState } from 'react'
import { DateValue } from '@heroui/react'

export type MedicationItem = {
  id: string
  name: string
  dose: string
  taken: boolean
  status: string
  frequency?: string
  instructions?: string
}

export const useMedications = (client: Client | null, date?: DateValue) => {
  const [medications, setMedications] = useState<MedicationItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!client)

  useEffect(() => {
    if (!client) {
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)

    const fetchAndProcessMedications = async () => {
      try {
        let patientId: string | null = null

        try {
          // Try to get patient ID from client
          const patientContext = await client.patient.read()
          patientId = patientContext.id
        } catch (patientErr) {
          // If can't get patient context, try to get from current user
          try {
            const user = await client.user.read()
            patientId = user.id
          } catch (userErr) {
            throw new Error('Patient context not available. Please select a patient first.')
          }
        }

        // If we have a patient ID, proceed with fetching medications
        if (!patientId) {
          throw new Error('Could not determine patient ID')
        }

        // Use direct request with patient ID instead of patient-scoped request
        const medicationRequestBundle = await client.request(`MedicationRequest?subject=Patient/${patientId}`)

        // Similar for medication administration
        const medicationAdminBundle = await client
          .request(`MedicationAdministration?subject=Patient/${patientId}${date ? `&date=${formatDateForFhir(date)}` : ''}`)
          .catch(() => null)

        // Process the data
        const processedMeds = processMedicationData(
          medicationRequestBundle as fhirclient.FHIR.Bundle,
          medicationAdminBundle as fhirclient.FHIR.Bundle | null,
          date
        )

        if (mounted) setMedications(processedMeds)
      } catch (err) {
        if (mounted) setError(`Failed to fetch Medications: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAndProcessMedications()

    return () => {
      mounted = false
    }
  }, [client, date])

  return { medications, error, loading, setMedications }
}

// Helper function to format date for FHIR queries
function formatDateForFhir(date: DateValue): string {
  const jsDate = new Date(date.toString())
  return jsDate.toISOString().split('T')[0] // YYYY-MM-DD format
}

// Process the FHIR medication data into a usable format
function processMedicationData(
  medicationBundle: fhirclient.FHIR.Bundle,
  administrationBundle: fhirclient.FHIR.Bundle | null,
  date?: DateValue
): MedicationItem[] {
  if (!medicationBundle.entry || medicationBundle.entry.length === 0) {
    return []
  }

  // Create a map of administrations by medication reference (if available)
  const administrationMap = new Map()
  if (administrationBundle?.entry) {
    administrationBundle.entry.forEach((entry) => {
      const admin = entry.resource
      if (admin && admin.medicationReference) {
        administrationMap.set(admin.medicationReference.reference, admin)
      }
    })
  }

  return medicationBundle.entry
    .filter((entry) => entry.resource)
    .map((entry) => {
      const resource = entry.resource

      // Extract medication name
      let name = 'Unknown Medication'
      if (resource.medicationCodeableConcept?.coding?.[0]?.display) {
        name = resource.medicationCodeableConcept.coding[0].display
      } else if (resource.medicationReference?.display) {
        name = resource.medicationReference.display
      }

      // Extract dosage information
      let dose = 'as directed'
      const dosageInstruction = resource.dosageInstruction?.[0]
      if (dosageInstruction?.doseAndRate?.[0]?.doseQuantity) {
        const dq = dosageInstruction.doseAndRate[0].doseQuantity
        dose = `${dq.value}${dq.unit || ''}`
      } else if (dosageInstruction?.text) {
        dose = dosageInstruction.text
      }

      // Determine if medication was taken
      const taken = determineIfTaken(resource, administrationMap, date)

      // Get frequency information
      let frequency = ''
      if (dosageInstruction?.timing?.code?.text) {
        frequency = dosageInstruction.timing.code.text
      }

      // Get additional instructions
      const instructions = dosageInstruction?.patientInstruction || ''

      return {
        id: resource.id || `med-${Math.random().toString(36).substr(2, 9)}`,
        name,
        dose,
        taken,
        status: resource.status || 'unknown',
        frequency,
        instructions
      }
    })
}

// Determine if a medication was taken based on administration records
function determineIfTaken(medicationRequest: any, administrationMap: Map<string, any>, date?: DateValue): boolean {
  const medicationRef = medicationRequest.medicationReference?.reference
  if (medicationRef && administrationMap.has(medicationRef)) {
    const admin = administrationMap.get(medicationRef)
    return admin.status === 'completed'
  }

  // Default fallback
  return false
}
