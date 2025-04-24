'use client'
import { title } from '@/components/primitives'
import { SmartLogin } from '@Components/auth/SmartLogin'

export default function Home() {
	return (
		<section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4">
			<div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-200">
				{/* Title */}
				<h1 className={`${title()} text-2xl md:text-3xl font-semibold text-gray-800 mb-4`}>
					Login to your Health Portal
				</h1>

				{/* Subtitle */}
				<p className="text-gray-600 mb-6">
					
				</p>
				<p className="text-gray-600 mb-8">
					Click below to login through your healthcare provider
				</p>

				{/* SmartLogin */}
				<div className="flex justify-center">
					<SmartLogin redirectUri="/dashboard" />
				</div>
			</div>
		</section>
	)
}
