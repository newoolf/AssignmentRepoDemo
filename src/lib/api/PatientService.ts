import { useState, useEffect } from 'react'
import type Client from 'fhirclient/lib/Client'
import type { fhirclient } from 'fhirclient/lib/types'

export const usePatient = (client: Client | null) => {
  const [patient, setPatient] = useState<fhirclient.FHIR.Patient | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!client)

  useEffect(() => {
    if (!client) {
      // When there's no client, skip fetching.
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)

    // Try multiple approaches to get patient data
    const fetchPatientData = async () => {
      try {
        let patientData = null

        // Try using patient context first
        try {
          patientData = await client.patient.read()
        } catch (patientErr) {
          console.warn('Could not get patient from patient context, trying user context')

          // If patient context fails, try user context
          if (client.user?.fhirUser) {
            patientData = await client.request(client.user.fhirUser as string)
          } else {
            throw new Error('No patient or user context available')
          }
        }

        if (mounted) setPatient(patientData)
      } catch (err) {
        if (mounted) setError(`Failed to fetch patient: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPatientData()

    return () => {
      mounted = false
    }
  }, [client])

  return { patient, error, loading }
}
