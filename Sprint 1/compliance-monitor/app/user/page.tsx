'use client'
import { useEffect, useState } from 'react'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'

export default function userProfilePage() {
	const { client, isLoading } = useFhirClient()
	const [patient, setPatient] = useState<string>('Patient data will be displayed here after login.')

	useEffect(() => {
		// TODO: This logic belongs in PatientService(patientId).getPatient()

		const fetchData = async () => {
			const patient = await client?.request('Patient').catch((error) => {
				console.error('Error initializing FHIR client:', error)
				setPatient('Error fetching patient data.')
			})
			setPatient(JSON.stringify(patient, null, 2))
		}

		fetchData()
	}, [client])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div>
			Patient Resource
			{patient}
		</div>
	)
}
