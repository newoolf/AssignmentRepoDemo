'use client'
import { useEffect, useState } from 'react'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { PatientService } from '@/lib/api/PatientService'

export default function userProfilePage() {
	const { client, isLoading } = useFhirClient()
	const [patient, setPatient] = useState<string>('Patient data will be displayed here after login.')

	useEffect(() => {
		// TODO: This logic belongs in PatientService(patientId).getPatient()

		// Skip if client is not ready
		if (!client) return

		const fetchPatient = async () => {
			const response = await new PatientService().requestPatient(client)
			setPatient(JSON.stringify(response, null, 2))
		}

		fetchPatient()
	}, [client])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className="flex flex-col gap-4">
			Patient Resource
			<div>{patient}</div>
		</div>
	)
}
