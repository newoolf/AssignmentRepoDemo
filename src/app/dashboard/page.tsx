'use client'

import { Card, CardBody } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { UserIcon } from '@/components/icons'
import { Divider } from '@heroui/react'
import MedicationManagementCard from '@Components/medication-management-card'

export default function DashboardPage() {
  // TODO: get actual user data from FHIR
  const user = {
    name: 'John Doe'
  }

  // TODO: fix with relevant info from FHIR
  const details = [
    { label: 'Email', value: 'john.doe@example.com' },
    { label: 'Role', value: 'Administrator' },
    { label: 'Member Since', value: 'January 2020' },
    { label: 'Location', value: 'New York' },
    { label: 'Last Login', value: 'March 5, 2024' }
  ]

  return (
    <main className="space-y-12">
      <section>
        <Card className="w-full p-2">
          <CardBody className="flex flex-row gap-4">
            <div className="col-span-1 w-[10rem] md:w-[12rem] h-[10rem] md:h-[12rem] gap-8 flex flex-col items-center justify-center">
              <Avatar size="lg" radius="lg" className="aspect-square w-full h-full bg-content2 text-content2-foreground">
                <UserIcon />
              </Avatar>
            </div>
            <div className="flex flex-col w-full">
              <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
              <p className="text-base md:text-lg">Welcome to your dashboard</p>
              <Divider className="m-1" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex">
                    <span className="font-semibold mr-2 text-sm md:text-base">{label}:</span>
                    <span className="text-sm md:text-base">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
      <MedicationManagementCard />
    </main>
  )
}
