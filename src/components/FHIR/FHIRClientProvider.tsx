'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import FHIR from 'fhirclient'
import Client from 'fhirclient/lib/Client'

interface FhirContextType {
	client: Client | null
	isLoading: boolean
	error: Error | null
	initialize: () => Promise<void>
	signOut: () => void // Add signOut type
}

export const FhirClientContext = createContext<FhirContextType>({
	client: null,
	isLoading: false,
	error: null,
	initialize: async () => {},
	signOut: () => {} // Add default signOut
})

export const useFhirClient = () => useContext(FhirClientContext)

export const FhirClientProvider = ({ children }: { children: React.ReactNode }) => {
	const [client, setClient] = useState<Client | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	const initialize = async () => {
		try {
			setIsLoading(true)
			setError(null)

			// Try to restore an existing session
			const smartClient = await FHIR.oauth2.ready()
			setClient(smartClient)
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)))
			// Ensure client is null if initialization fails
			setClient(null)
			// Clear storage if ready() fails, as there might be invalid state
			sessionStorage.clear()
			localStorage.clear()
		} finally {
			setIsLoading(false)
		}
	}

	const signOut = () => {
		console.log('Signing out from provider...')
		// Clear FHIR client session storage
		sessionStorage.clear()
		// Clear any other relevant local storage if needed
		localStorage.clear()
		// Reset the client state in the context
		setClient(null)
		setError(null)
		// No need to set isLoading here unless you have async signout ops
		console.log('Client state reset.')
	}

	// Auto-initialize on component mount
	useEffect(() => {
		initialize()
	}, [])

	// Pass signOut in the context value
	return <FhirClientContext.Provider value={{ client, isLoading, error, initialize, signOut }}>{children}</FhirClientContext.Provider>
}
