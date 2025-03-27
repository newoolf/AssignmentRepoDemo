'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import FHIR from 'fhirclient'
import Client from 'fhirclient/lib/Client'

interface FhirContextType {
	client: Client | null
	isLoading: boolean
	error: Error | null
	initialize: () => Promise<void>
}

export const FhirClientContext = createContext<FhirContextType>({
	client: null,
	isLoading: true,
	error: null,
	initialize: async () => {}
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
		} finally {
			setIsLoading(false)
		}
	}

	// Auto-initialize on component mount
	useEffect(() => {
		initialize()
	}, [])

	return <FhirClientContext.Provider value={{ client, isLoading, error, initialize }}>{children}</FhirClientContext.Provider>
}
