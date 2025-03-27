import FHIR from 'fhirclient'
import { useFhirClient } from '../FHIR/FHIRClientProvider'
import { log } from 'console'

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
			clientId: 'my_web_app',
			scope: 'openid fhirUser user/*.read',
			iss: 'https://launch.smarthealthit.org/v/r4/sim/WzMsImQ0ZmIzYmJhLTczYTktNGI4Mi1hMGJjLTY3OGQ0N2YzODZiNCIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMSwiIl0/fhir',
			redirectUri: redirectUri
		})
	}

	if (isLoading) {
		console.log('Any 43')
		debugger
		return <div>Checking authentication status...</div>
	}

	if (client) {
		console.log('Any 2')
		console.log(client)

		return <div>Already authenticated!</div>
	}

	return (
		<div>
			{error && <p className="error">Error: {error.message}</p>}
			<button onClick={handleLogin}>Login with SMART</button>
		</div>
	)
}
