import { Report } from '@/types/Report'
import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: Figure out slug for this endpoint

// INFO: Request Method Handler
export default function handler(req: NextApiRequest, res: NextApiResponse<Report>) {
	if (req.method === 'GET') {
		const { id } = req.query
		res.status(200).json(getReport(id as string))
	} else {
		res.setHeader('Allow', ['GET'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}

// TODO: Implement the following functions

// INFO: Report Generation
function getReport(id: string): Report {
	return {} as Report
}
