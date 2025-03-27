'use client'

import { Button } from '@heroui/button'

export default function LoginPage() {
	return (
		<div className="w-full text-center">
			<Button
				color="success"
				onPress={() => {
					window.location.href = '/'
				}}
			>
				Nothing To See Here 😸
			</Button>
		</div>
	)
}
