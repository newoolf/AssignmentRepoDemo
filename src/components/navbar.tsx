'use client'

import { GithubIcon, Logo } from '@/components/icons'
import { ThemeSwitch } from '@/components/theme-switch'
import { siteConfig } from '@/config/site'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import { link as linkStyles } from '@heroui/theme'
import clsx from 'clsx'
import NextLink from 'next/link'
import { useFhirClient } from './FHIR/FHIRClientProvider'
import { SmartLogin } from './auth/SmartLogin'

export const Navbar = () => {
	const { navItems, navMenuItems, links } = siteConfig
	const { client, isLoading } = useFhirClient()
	const isLoggedIn = !isLoading && client

	// Determine the correct set of nav items based on login status
	const currentNavItems = isLoggedIn ? navItems.loggedIn : navItems.loggedOut
	const currentNavMenuItems = isLoggedIn ? navMenuItems.loggedIn : navMenuItems.loggedOut

	return (
		<HeroUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">COMPLIANCE</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{/* Map over the selected nav items */}
					{currentNavItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(linkStyles({ color: 'foreground' }), 'data-[active=true]:text-primary data-[active=true]:font-medium')}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Button
						isExternal
						as={Link}
						className="w-auto h-auto bg-transparent rounded-lg flex items-center justify-center group-data-[selected=true]:bg-transparent !text-default-500 pt-px px-0 mx-0"
						href={links.github}
						isIconOnly
					>
						<GithubIcon className="text-primary" />
					</Button>
				</NavbarItem>

				<NavbarItem className="hidden sm:flex gap-2">
					<ThemeSwitch />
				</NavbarItem>

				<NavbarItem className="hidden md:flex">
					<SmartLogin redirectUri="/dashboard" />
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal aria-label="Github" href={links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{/* Map over the selected menu items */}
					{currentNavMenuItems.map((item, index) => (
						// Use item.href for the key if it's unique
						<NavbarMenuItem key={item.href}>
							<Link
								// Consider simplifying this color logic or moving it to siteConfig
								color={index === 2 ? 'primary' : index === currentNavMenuItems.length - 1 ? 'danger' : 'foreground'}
								// Use item.href for the link destination
								href={item.href}
								size="lg"
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	)
}
