import { User } from '@/types/User'
import type { NextApiRequest, NextApiResponse } from 'next'

// INFO: Request Method Handler
export default function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	if (req.method === 'GET') {
		const { id } = req.query
		res.status(200).json(getUser(id as string))
	}

	if (req.method === 'POST') {
		const User = req.body as User
		res.status(200).json(postUser(User))
	}

	if (req.method === 'PUT') {
		const { id } = req.query
		const User = req.body as User
		res.status(200).json(putUser(id as string, User))
	}

	if (req.method === 'DELETE') {
		const { id } = req.query
		deleteUser(id as string)
	}
}

// TODO: Implement the following functions

// INFO: User Retrieval
function getUser(id: string): User {
	return {} as User
}

// INFO: User Creation
function postUser(User: User): User {
	return {} as User
}

// INFO: User Update
function putUser(id: string, User: User): User {
	return {} as User
}

// !!!: We probably wont need to ever implement this
// INFO: User Deletion
function deleteUser(id: string): void {
	return
}
