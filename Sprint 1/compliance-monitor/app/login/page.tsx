'use client'

import { SmartLogin } from '@Components/auth/SmartLogin'
import { useFhirClient } from '@Components/FHIR/FHIRClientProvider'
import { Button } from '@heroui/button'
import Link from 'next/link'

export default function LoginPage() {
	const { client, isLoading, error } = useFhirClient()

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!client || client == null) {
		return <SmartLogin redirectUri={'/user'} />
	}

	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<div className="flex flex-col gap-2">
			Logged in
			<Button>
				<Link href={'/user'}>Redirect</Link>
			</Button>
		</div>
	)
}
