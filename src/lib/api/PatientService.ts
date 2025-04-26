import { useState, useEffect } from 'react'
import Client from 'fhirclient/lib/Client'
import { fhirclient } from 'fhirclient/lib/types'

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
		client
			.request(client.user.fhirUser)
			.then((data) => {
				if (mounted) setPatient(data)
			})
			.catch((err) => {
				if (mounted) setError(`Failed to fetch patient: ${err.message}`)
			})
			.finally(() => {
				if (mounted) setLoading(false)
			})
		return () => {
			mounted = false
		}
	}, [client])

	return { patient, error, loading }
}
