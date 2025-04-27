export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: {
    loggedOut: [
      {
        label: 'About',
        href: '/about'
      }
    ],
    loggedIn: [
      {
        label: 'Dashboard ',
        href: '/dashboard'
      },
      {
        label: 'Profile',
        href: '/user'
      }
    ]
  },
  navMenuItems: {
    loggedOut: [
      {
        label: 'About',
        href: '/about'
      }
    ],
    loggedIn: [
      {
        label: 'Dashboard ',
        href: '/dashboard'
      },
      {
        label: 'Profile',
        href: '/user'
      }
    ]
  },
  links: {
    github: 'https://github.com/newoolf/AssignmentRepoDemo'
  }
}
