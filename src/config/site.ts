export type SiteConfig = typeof siteConfig

export const siteConfig = {
	name: 'Next.js + HeroUI',
	description: 'Make beautiful websites regardless of your design experience.',
	navItems: [
		{
			label: 'Dashboard ',
			href: '/dashboard'
		},
		{
			label: 'Login',
			href: '/login'
		},
		{
			label: 'Add Medication',
			href: '/addmedication'

		},
		{
			label: 'SIGN OUT',
			href: '/signout'

		}
	],
	navMenuItems: [
		{
			label: 'Dashboard',
			href: '/dashboard'
		},
		{
			label: 'Login',
			href: '/login'
		},
		{
			label: 'Add Medication',
			href: '/addmedication'

		},
		{
			label: 'SIGN OUT',
			href: '/signout'

		}
	],
	links: {
		github: 'https://github.com/newoolf/AssignmentRepoDemo'
	}
}
