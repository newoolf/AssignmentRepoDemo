export type SiteConfig = typeof siteConfig

export const siteConfig = {
	name: 'Next.js + HeroUI',
	description: 'Make beautiful websites regardless of your design experience.',
	navItems: [
		{
			label: 'Home',
			href: '/'
		},
		{
			label: 'Login',
			href: '/login'
		}
	],
	navMenuItems: [
		{
			label: 'Home',
			href: '/'
		},
		{
			label: 'Login',
			href: '/login'
		}
	],
	links: {
		github: 'https://github.com/newoolf/AssignmentRepoDemo'
	}
}
