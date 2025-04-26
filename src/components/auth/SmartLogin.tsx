'use client'

import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Snippet } from '@heroui/snippet'
import FHIR from 'fhirclient'
import { useFhirClient } from '../FHIR/FHIRClientProvider'

interface SmartLoginProps {
	serverUrl?: string
	clientId?: string
	redirectUri: string
}

export const SmartLogin = ({ redirectUri }: SmartLoginProps) => {
	const { client, isLoading, error, signOut } = useFhirClient()

	const handleLogin = () => {
		FHIR.oauth2.authorize({
			clientId: 'complication-monitor',
			scope: 'openid fhirUser user/*.read patient/*.read',
			iss: 'https://launch.smarthealthit.org/v/r4/sim/WzMsIjU4YzU4MGNjLTliYzktNDU2OS1hNTFhLTc2ZGIwMDkzNTYyNywwZTYxYzNhZC1kMTFlLTQwODAtYTZhYS1jYWM4OWNhZTRlMzcsNzIwYjkxMTgtMzE1My00MGM4LWIxNjItY2Q5NjM1MDZiZTBlIiwiIiwiQVVUTyIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMCwxLCIiXQ/fhir',
			redirectUri: redirectUri
		})
	}

	function AuthDisplay() {

		if (isLoading && client != null) {
			return (
				<Button color="secondary" radius="md" disabled isLoading>
					Loading...
				</Button>
			)
		}

		if (error && client != null) {
			return (
				<Snippet color="warning" hideCopyButton symbol="ERROR:">
					{`Login Error: ${error.message}`}
				</Snippet>
			)
		}

		if (client == null) {
			return (
				<Button onPress={handleLogin} color="primary" radius="md">
					Login with Smart
				</Button>
			)
		}

		// If logged in (client exists) -> Show Sign Out
		return (
			<Button
				as={Link}
				onPress={signOut}
				href={'/'}
				color="warning"
				variant="flat"
				radius="md"
			>
				Sign Out
			</Button>
		)
	}

	return <AuthDisplay />
}
