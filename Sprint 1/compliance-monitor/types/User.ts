import { HumanName, Identifier, Patient } from 'fhir/r5'

/**
 * Represents a user in the compliance monitor application
 * @interface User
 */
export interface User {
	/**
	 * Unique identifier for the user
	 */
	id: string

	/**
	 * User's full name
	 */
	name: HumanName

	/**
	 * User's email address
	 */
	email: string

	/**
	 * User's role in the system (e.g., "patient", "admin")
	 */
	role: UserRole

	/**
	 * Date when the user account was created
	 */
	createdAt: Date

	/**
	 * Optional reference to a FHIR Patient resource if the user is a patient
	 */
	patientId?: Identifier
}

/**
 * Available user roles in the system
 * @enum {string}
 */
export enum UserRole {
	PATIENT = 'patient',
	ADMIN = 'admin'
}
