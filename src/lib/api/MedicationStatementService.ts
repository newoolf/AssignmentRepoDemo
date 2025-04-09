import { useState, useEffect } from 'react'
import Client from 'fhirclient/lib/Client'
import { fhirclient } from 'fhirclient/lib/types'


/**
 * Custom hook to fetch MedicationStatement data from FHIR server.
 * @param client - FHIR client instance.
 * @returns An Bundle containing medicationStatement data Bundle, error message, and loading state.
 */
export const useMedicationStatement = (client: Client | null) => {
    const [medicationStatement, setMedicationStatement] = useState<fhirclient.FHIR.Bundle | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(!!client)

	useEffect(() => {
		if (!client) {
			// When there's no client, skip fetching.
			setLoading(false)
			return
		}
		let mounted = true
		setLoading(true)
		client
			.request(`MedicationStatement`)
			.then((data) => {
				if (mounted) setMedicationStatement(data)
			})
			.catch((err) => {
				if (mounted) setError(`Failed to fetch Medication Statement: ${err.message}`)
			})
			.finally(() => {
				if (mounted) setLoading(false)
			})
		return () => {
			mounted = false
		}
	}, [client])

	return { medicationStatement, error, loading }
}

/**
 * 
 * @param medication medicationRequest.medication object
 * @param derivedFrom medicationRequest object
 * @returns medicationStatement object
 */
export const createMedicationStatement = async (client: Client, medication, derivedFrom) => {
    const medicationStatementBody = {
        resourceType: 'MedicationStatement',
        status: 'Recorded',
        medication: [
            {
                concept: medication.medication.concept,
                reference: medication.medication.reference
            }
        ],
        subject: medication.subject,
        derivedFrom: [
            {
                reference: [
                    {
                        reference: ['MedicationRequest', derivedFrom.id].join('/'),
                        type: 'MedicationRequest'
                    }
                ]
            }
        ],
        note: [
            {
                text: `Patient created medication adherence record created for ${medication.display}`
            }
        ]
    }
    try {
        const response = await client.create({ medicationStatement: medicationStatementBody })
        console.log(response)
        return response
    } catch (error) {
        throw new Error(`Failed to add Medication Statement: ${error.message}`)
    }
}

