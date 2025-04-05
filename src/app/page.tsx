'use client'

import { title } from '@/components/primitives'
import { SmartLogin } from '@Components/auth/SmartLogin'

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-xl text-center justify-center">
				<span className={title()}>Click below to login through your healthcare provider.</span>
			</div>

			<div className="flex gap-3">
				<SmartLogin redirectUri={'/user'} />
			</div>
		</section>
	)
}
