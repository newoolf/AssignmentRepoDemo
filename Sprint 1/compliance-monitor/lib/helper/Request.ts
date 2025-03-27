export default class Request {
	static async get(url: string): Promise<Response> {
		return await fetch(url)
	}

	static async post(url: string, data: any): Promise<Response> {
		return await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	static async put(url: string, data: any): Promise<Response> {
		return await fetch(url, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	static async delete(url: string): Promise<Response> {
		return await fetch(url, {
			method: 'DELETE'
		})
	}
}
