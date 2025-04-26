import { useState, useEffect } from 'react'
import type Client from 'fhirclient/lib/Client'
import type { fhirclient } from 'fhirclient/lib/types'
import type { Medication, Reference } from 'fhir/r5'


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
			.request(`MedicationStatement/${client.patient.id}`)
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
 * @param derivedFrom medicationRequest object reference
 * @returns medicationStatement object
 */
export const createMedicationStatement = async (client: Client, medication: Medication, derivedFrom: Reference) => {
    const medicationStatementBody = {
        resourceType: 'MedicationStatement',
        status: 'Recorded',
        medicationCodeableConcept: {
            coding: [
                {
                    system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                    code: medication.code,
                    display: medication.identifier?.[0]?.value || medication.code
                }
            ]
        },
        derivedFrom: [
            {
                reference: derivedFrom
            }
        ],
        note: [
            {
                text: `Patient created medication adherence record created for ${medication.identifier?.[0]?.value || medication.code} on ${new Date().toISOString()}`
            }
        ]
    }
    try {
        const response = await client.create({ medicationStatement: medicationStatementBody })
        return response
    } catch (error) {
        throw new Error("Failed to add Medication Statement")
    }
}

/**
 * TODO: Create a function to add notes to the medication statement corresponding to adherence reports from the patient
*/
