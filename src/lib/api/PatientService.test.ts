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
})
