import { MedicationAdministration } from 'fhir/r5'
import type { NextApiRequest, NextApiResponse } from 'next'

// INFO: Request Method Handler
export default function handler(req: NextApiRequest, res: NextApiResponse<MedicationAdministration>) {
	if (req.method === 'GET') {
		const { id } = req.query
		res.status(200).json(getMedicationAdministration(id as string))
	}

	if (req.method === 'POST') {
		const MedicationAdministration = req.body as MedicationAdministration
		res.status(200).json(postMedicationAdministration(MedicationAdministration))
	}

	if (req.method === 'PUT') {
		const { id } = req.query
		const MedicationAdministration = req.body as MedicationAdministration
		res.status(200).json(putMedicationAdministration(id as string, MedicationAdministration))
	}

	if (req.method === 'DELETE') {
		const { id } = req.query
		deleteMedicationAdministration(id as string)
	}
}

// TODO: Implement the following functions

// INFO: MedicationAdministration Retrieval
function getMedicationAdministration(id: string): MedicationAdministration {
	return {} as MedicationAdministration
}

// INFO: MedicationAdministration Creation
function postMedicationAdministration(MedicationAdministration: MedicationAdministration): MedicationAdministration {
	return {} as MedicationAdministration
}

// INFO: MedicationAdministration Update
function putMedicationAdministration(id: string, MedicationAdministration: MedicationAdministration): MedicationAdministration {
	return {} as MedicationAdministration
}

// !!!: We probably wont need to ever implement this
// INFO: MedicationAdministration Deletion
function deleteMedicationAdministration(id: string): void {
	return
}
