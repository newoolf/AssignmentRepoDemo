import { Medication } from 'fhir/r5'
import type { NextApiRequest, NextApiResponse } from 'next'

// INFO: Request Method Handler
export default function handler(req: NextApiRequest, res: NextApiResponse<Medication>) {
	if (req.method === 'GET') {
		const { id } = req.query
		res.status(200).json(getMedication(id as string))
	}

	if (req.method === 'POST') {
		const Medication = req.body as Medication
		res.status(200).json(postMedication(Medication))
	}

	if (req.method === 'PUT') {
		const { id } = req.query
		const Medication = req.body as Medication
		res.status(200).json(putMedication(id as string, Medication))
	}

	if (req.method === 'DELETE') {
		const { id } = req.query
		deleteMedication(id as string)
	}
}

// TODO: Implement the following functions

// INFO: Medication Retrieval
function getMedication(id: string): Medication {
	return {} as Medication
}

// INFO: Medication Creation
function postMedication(Medication: Medication): Medication {
	return {} as Medication
}

// INFO: Medication Update
function putMedication(id: string, Medication: Medication): Medication {
	return {} as Medication
}

// !!!: We probably wont need to ever implement this
// INFO: Medication Deletion
function deleteMedication(id: string): void {
	return
}
