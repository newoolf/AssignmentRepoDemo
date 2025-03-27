'use client'

import { subtitle } from '@Components/primitives'
import { Button } from '@heroui/button'
import { Snippet } from '@heroui/snippet'
import FHIR from 'fhirclient'
import { useFhirClient } from '../FHIR/FHIRClientProvider'

interface SmartLoginProps {
	serverUrl?: string
	clientId?: string
	redirectUri: string
}

export const SmartLogin = ({ redirectUri }: SmartLoginProps) => {
	const { client, isLoading, error } = useFhirClient()

	const handleLogin = () => {
		console.log('Any 1')
		FHIR.oauth2.authorize({
			clientId: 'complication-monitor',
			scope: 'openid fhirUser user/*.read',
			iss: 'https://launch.smarthealthit.org/v/r4/sim/WzMsImQ0ZmIzYmJhLTczYTktNGI4Mi1hMGJjLTY3OGQ0N2YzODZiNCIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMSwiIl0/fhir',
			redirectUri: redirectUri
		})
	}

	function LoginButton() {
		if (!client || client == null) {
			return (
				<Button onPress={handleLogin} color="primary" radius="md">
					Login with Smart
				</Button>
			)
		}

		if (isLoading) {
			return (
				<Button color="secondary" radius="md" disabled>
					Loading...
				</Button>
			)
		}

		if (error) {
			return (
				<Snippet color="warning" hideCopyButton symbol="ERROR:">
					{error.message}
				</Snippet>
			)
		}
	}

	if (!isLoading && client) {
		return (
			<div className="flex flex-col gap-3">
				<span className={subtitle()}>Already Logged in.</span>
				<Button onPress={() => (window.location.href = redirectUri)}>Redirect</Button>
			</div>
		)
	}

	return <LoginButton />
}
