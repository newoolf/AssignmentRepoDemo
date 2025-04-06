'use client'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { PatientService } from '@/lib/api/PatientService'
import { title } from '@Components/primitives'
import { useEffect, useState } from 'react'
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
		<>
			<span className={title()}>Patient Resource</span>
			<pre className="text-left bg-foreground-100 p-4 rounded-md mt-4 whitespace-pre-wrap break-words">{patient}</pre>
		</>
	)
}
