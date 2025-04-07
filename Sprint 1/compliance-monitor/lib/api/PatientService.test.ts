import { PatientService } from './PatientService'
import Client from 'fhirclient/lib/Client'
import { fhirclient } from 'fhirclient/lib/types'

describe('PatientService', () => {
	let patientService: PatientService
	let mockClient: Partial<Client>

	beforeEach(() => {
		// Mock the FHIR client
		mockClient = {
			request: jest.fn()
		}
		patientService = new PatientService()
	})

	describe('requestPatient', () => {
		it('should fetch the current patient successfully', async () => {
			// Arrange
			;(mockClient.request as jest.Mock).mockResolvedValue({
				resourceType: 'Patient',
				id: '58691811-a925-45ff-9c66-7e4758eaa96f'
			} as fhirclient.FHIR.Patient)

			// Act
			const result = await patientService.requestPatient(mockClient as Client)

			// Assert
			expect(mockClient.request).toHaveBeenCalledWith('Patient')
			expect(result.id).toBe('58691811-a925-45ff-9c66-7e4758eaa96f')
		})

		it('should throw an error for a failed patient request', async () => {
			// Arrange
			;(mockClient.request as jest.Mock).mockRejectedValue(new Error('Network error'))

			// Act & Assert
			await expect(patientService.requestPatient(mockClient as Client)).rejects.toThrow('Failed to fetch patient: Network error')
		})
	})

	describe('getPatientById', () => {
		it('should fetch a patient by ID', async () => {
			// Arrange
			;(mockClient.request as jest.Mock).mockResolvedValue({
				resourceType: 'Patient',
				id: '58691811-a925-45ff-9c66-7e4758eaa96f'
			} as fhirclient.FHIR.Patient)

			// Act
			const result = await patientService.requestPatientById(mockClient as Client, '58691811-a925-45ff-9c66-7e4758eaa96f')

			// Assert
			expect(mockClient.request).toHaveBeenCalledWith('Patient/58691811-a925-45ff-9c66-7e4758eaa96f')
			expect(result.id).toBe('58691811-a925-45ff-9c66-7e4758eaa96f')
		})

		it('should throw an error if fetching by ID fails', async () => {
			// Arrange
			;(mockClient.request as jest.Mock).mockRejectedValue(new Error('Network error'))

			// Act & Assert
			await expect(patientService.requestPatientById(mockClient as Client, '58691811-a925-45ff-9c66-7e4758eaa96f')).rejects.toThrow(
				'Failed to fetch patient: Network error with id 58691811-a925-45ff-9c66-7e4758eaa96f'
			)
		})
	})

	describe('getPatientByIdentifier', () => {
		it('should fetch patients matching a specific identifier', async () => {
			// Arrange: mock a FHIR Bundle with one Patient resource
			;(mockClient.request as jest.Mock).mockResolvedValue({
				resourceType: 'Bundle',
				entry: [
					{
						resource: {
							resourceType: 'Patient',
							id: 'patient-with-identifier'
						}
					}
				]
			} as fhirclient.FHIR.Bundle)

			// Act
			const system = 'http://hl7.org/fhir/sid/us-ssn'
			const value = '999-29-3778'
			const result = await patientService.requestPatientByIdentifier(mockClient as Client, system, value)

			// Assert
			expect(mockClient.request).toHaveBeenCalledWith(`Patient?identifier=${encodeURIComponent(system)}|${encodeURIComponent(value)}`)
			expect(result.entry?.[0].resource?.id).toBe('patient-with-identifier')
		})

		it('should handle an error when fetching patients by identifier', async () => {
			// Arrange
			;(mockClient.request as jest.Mock).mockRejectedValue(new Error('Server unavailable'))

			// Act & Assert
			const system = 'http://hl7.org/fhir/sid/us-ssn'
			const value = '999-29-3778'
			await expect(patientService.requestPatientByIdentifier(mockClient as Client, system, value)).rejects.toThrow(
				`Failed to fetch patient: Server unavailable with system ${system} and value ${value}`
			)
		})
	})
})
