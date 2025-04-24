'use client'

import { subtitle } from '@Components/primitives'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Snippet } from '@heroui/snippet'
import FHIR from 'fhirclient'
import { useFhirClient } from '../FHIR/FHIRClientProvider'
import {useEffect} from 'react'
import{useRouter} from 'next/navigation'

interface SmartLoginProps {
	serverUrl?: string
	clientId?: string
	redirectUri: string
}

export const SmartLogin = ({ redirectUri }: SmartLoginProps) => {
	const { client, isLoading, error } = useFhirClient()
	const router = useRouter()

	const handleLogin = () => {
		FHIR.oauth2.authorize({
			clientId: 'complication-monitor',
			scope: 'openid fhirUser user/*.read patient/*.read',
			iss: 'https://launch.smarthealthit.org/v/r4/sim/WzMsIjU4YzU4MGNjLTliYzktNDU2OS1hNTFhLTc2ZGIwMDkzNTYyNywwZTYxYzNhZC1kMTFlLTQwODAtYTZhYS1jYWM4OWNhZTRlMzcsNzIwYjkxMTgtMzE1My00MGM4LWIxNjItY2Q5NjM1MDZiZTBlIiwiIiwiQVVUTyIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMCwxLCIiXQ/fhir',
			redirectUri:'/dashboard'
		})
	}
	useEffect(() => {
		if(!isLoading && client) {
			router.push(redirectUri)
		}
	}, [isLoading, client, redirectUri, router])

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

	// if (!isLoading && client) {
	// 	return (
	// 		<div className="flex flex-col gap-3">
	// 			<span className={subtitle()}>Already Logged in.</span>
	// 			<Button as={Link} href={redirectUri}>
	// 				Redirect
	// 			</Button>
	// 		</div>
	// 	)
	// }

	return <LoginButton />
}
