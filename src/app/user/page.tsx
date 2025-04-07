'use client'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { usePatient } from '@/lib/api/PatientService'
import { title } from '@Components/primitives'

export default function UserProfilePage() {
	const { client, isLoading } = useFhirClient()

	const { patient, error, loading } = usePatient(client)

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (loading) {
		return <div>Loading patient data...</div>
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<>
			<span className={title()}>Patient Resource</span>
			<pre className="text-left bg-foreground-100 p-4 rounded-md mt-4 whitespace-pre-wrap break-words">{JSON.stringify(patient, null, 2)}</pre>
		</>
	)
}
