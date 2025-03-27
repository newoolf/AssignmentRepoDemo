import { Link } from '@heroui/link'
import { button as buttonStyles } from '@heroui/theme'
import { title } from '@/components/primitives'

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-xl text-center justify-center">
				<span className={title()}>Click below to login through your healthcare provider.</span>
			</div>

			<div className="flex gap-3">
				<Link
					className={buttonStyles({
						color: 'primary',
						radius: 'md',
						variant: 'shadow'
					})}
					href={'/login'}
				>
					Login
				</Link>
			</div>

			<div className="mt-8"></div>
		</section>
	)
}
