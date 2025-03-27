/**
 * @fileoverview Implements business logic for handling FHIR Patient resources
 * @module PatientService
 */

import Client from 'fhirclient/lib/Client'
import { fhirclient } from 'fhirclient/lib/types'

/**
 * PatientService provides methods to interact with FHIR Patient resources
 */
export class PatientService {
	/**
	 * Request the current patient
	 * @param client - The authenticated FHIR client
	 * @returns The patient resource
	 */
	requestPatient(client: Client): Promise<fhirclient.FHIR.Patient> {
		return client.request(`Patient`).catch((err) => {
			throw new Error(`Failed to fetch patient: ${err.message}`)
		})
	}

	/**
	 * Get a patient by ID
	 * @param client - The authenticated FHIR client
	 * @param id - The patient's resource ID
	 * @returns The patient resource
	 */
	async getPatientById(client: Client, id: string): Promise<fhirclient.FHIR.Patient> {
		return await client.request(`Patient/${id}`).catch((err) => {
			throw new Error(`Failed to fetch patient: ${err.message} with id ${id}`)
		})
	}

	/**
	 * Get patients by identifier (e.g., MRN, SSN)
	 * @param client - The authenticated FHIR client
	 * @param system - The identifier system
	 * @param value - The identifier value
	 * @returns Bundle of matching patient resources
	 */
	async getPatientByIdentifier(client: Client, system: string, value: string): Promise<fhirclient.FHIR.Bundle> {
		return await client.request(`Patient?identifier=${encodeURIComponent(system)}|${encodeURIComponent(value)}`).catch((err) => {
			throw new Error(`Failed to fetch patient: ${err.message} with system ${system} and value ${value}`)
		})
	}
}
