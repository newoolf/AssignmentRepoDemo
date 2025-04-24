'use client'

import { Button } from '@heroui/button'
import { Link } from '@heroui/link'

export default function LoginPage() {
	return (
			<div className="w-full text-center py-6">
			  <Button
				color="success"
				as={Link}
				href="/dashboard"
				className="text-lg px-8 py-4 rounded-xl font-semibold"
			  >
				You are already logged in. Click here to return to dashboard 😸
			  </Button>
			</div>
		  )
		  
}
