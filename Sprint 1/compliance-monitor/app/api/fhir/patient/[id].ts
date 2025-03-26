import { Patient } from 'fhir/r5'
import type { NextApiRequest, NextApiResponse } from 'next'

// INFO: Request Method Handler
export default function handler(req: NextApiRequest, res: NextApiResponse<Patient>) {
	if (req.method === 'GET') {
		const { id } = req.query
		res.status(200).json(getPatient(id as string))
	}

	if (req.method === 'POST') {
		const patient = req.body as Patient
		res.status(200).json(postPatient(patient))
	}

	if (req.method === 'PUT') {
		const { id } = req.query
		const patient = req.body as Patient
		res.status(200).json(putPatient(id as string, patient))
	}

	if (req.method === 'DELETE') {
		const { id } = req.query
		deletePatient(id as string)
	}
}

// TODO: Implement the following functions

// INFO: Patient Retrieval
function getPatient(id: string): Patient {
	return {} as Patient
}

// INFO: Patient Creation
function postPatient(patient: Patient): Patient {
	return {} as Patient
}

// INFO: Patient Update
function putPatient(id: string, patient: Patient): Patient {
	return {} as Patient
}

// !!!: We probably wont need to ever implement this
// INFO: Patient Deletion
function deletePatient(id: string): void {
	return
}
