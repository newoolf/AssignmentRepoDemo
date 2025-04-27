import { useState, useEffect } from 'react'
import type Client from 'fhirclient/lib/Client'
import type { fhirclient } from 'fhirclient/lib/types'

export const useMedication = (client: Client | null) => {
	const [medication, setMedication] = useState<fhirclient.FHIR.Bundle | null>(null)
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
		client
			.patient.request("MedicationRequest")
			.then((data) => {
				if (mounted) setMedication(data as fhirclient.FHIR.Bundle)
			})
			.catch((err) => {
				if (mounted) setError(`Failed to fetch Medication: ${err.message}`)
			})
			.finally(() => {
				if (mounted) setLoading(false)
			})
		return () => {
			mounted = false
		}
	}, [client])

	return { medication, error, loading }
}
