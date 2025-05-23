import '@/styles/globals.css'
import { fontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import { FhirClientProvider } from '@Components/FHIR/FHIRClientProvider'
import { Navbar } from '@Components/navbar'
import { Link } from '@heroui/link'
import clsx from 'clsx'
import { Metadata, Viewport } from 'next'
import React from 'react'
import { Providers } from './providers'

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`
	},
	description: siteConfig.description,
	icons: {
		icon: '/favicon.ico'
	}
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
				<Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
					<FhirClientProvider>
						<Navbar />
						<div className="relative flex flex-col h-screen">
							<main className="container mx-auto max-w-7xl pt-8 p-6 flex-grow">{children}</main>
							<footer className="w-full flex items-center justify-center py-3">
								<Link
									isExternal
									className="flex items-center gap-1 text-current"
									href="https://heroui.com?utm_source=next-app-template"
									title="heroui.com homepage"
								></Link>
							</footer>
						</div>
					</FhirClientProvider>
				</Providers>
			</body>
		</html>
	)
}
