'use client'
import { Avatar } from '@heroui/avatar'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Image } from '@heroui/image'
import { motion } from 'framer-motion'

// Hero Section Component //
const HeroSection = () => (
  <motion.section
    className="flex flex-col-reverse md:flex-row items-center justify-between w-full px-4 sm:px-10 lg:px-20 gap-10"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Text Content */}
    <div className="w-full md:w-1/2 sm:text-center">
      <h1 className="text-4xl font-bold">Welcome Back!</h1>
      <p className="text-xl">Stay on top of your prescriptions with personalized medication reminders!</p>
    </div>
    {/* Image Content */}
    <motion.div
      className="w-full md:w-1/2 flex justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Image src="/medicationsPic.jpg" alt="Picture of medication pills" className="rounded-lg shadow-lg w-full max-w-lg" />
    </motion.div>
  </motion.section>
)

// Features Section Component //
const featuresData = [
  { icon: '💊', title: 'Track Every Dose', desc: 'Never miss a medication with smart reminders and alerts.' },
  { icon: '📈', title: 'Monitor Progress', desc: 'Visualize your adherence and stay on track effortlessly.' }
]

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    // Accept custom index for delay
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Stagger delay based on index
      duration: 0.5
    }
  })
}

const FeaturesSection = () => (
  <motion.section
    className="sm:px-10 lg:px-20 flex flex-col sm:flex-row gap-8 md:gap-12 justify-center"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    {featuresData.map((item, i) => (
      <motion.div
        key={item.title}
        custom={i} // Pass index to variants
        variants={featureVariants}
        className="flex justify-center mb-10"
      >
        {/* <div className="text-4xl mb-2">{item.icon}</div>
					<h3 className="text-xl font-medium">{item.title}</h3>
					<p className="">{item.desc}</p> */}
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Avatar radius="none" name={item.icon} className="text-3xl bg-transparent" />
            <div className="text-xl font-medium">{item.title}</div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{item.desc}</p>
          </CardBody>
        </Card>
      </motion.div>
    ))}
  </motion.section>
)

// Testimonial Section Component //
const TestimonialSection = () => (
  <motion.section
    className="sm:px-10 lg:px-20 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    viewport={{ once: true }}
  >
    <blockquote>"This has helped me never miss a dose again. The reminders are spot on and it makes managing my meds so easy!"</blockquote>
    <p className="text-foreground-500">- A Real Patient</p>
  </motion.section>
)

// Main Dashboard Page Component //
export default function DashboardPage() {
  return (
    <main className="space-y-12">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
    </main>
  )
}
