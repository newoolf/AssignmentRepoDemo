'use client'

import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { UserIcon } from '@/components/icons'
import MedicationManagementCard from '@Components/medication-management-card'
import { usePatient } from '@Lib/api/PatientService'
import { Avatar } from '@heroui/avatar'
import { Card, CardBody } from '@heroui/card'
import { Divider } from '@heroui/react'

// Helper function to safely extract patient details
const extractPatientDetails = (patient: any) => {
  if (!patient)
    return {
      name: 'Unknown Name',
      phone: 'Unknown Phone Number',
      email: 'Unknown Email',
      dob: 'Unknown Birth Date',
      address: 'Unknown Location'
    }

  const name = patient.name?.[0]
  const telecom = patient.telecom || []
  const addresses = patient.address || []

  return {
    name: name ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim() : 'Unknown Name',
    phone: telecom.find((t: any) => t.system === 'phone')?.value || 'Unknown Phone Number',
    email: telecom.find((t: any) => t.system === 'email')?.value || 'Unknown Email',
    dob: patient.birthDate || 'Unknown Birth Date',
    address: addresses[0] ? formatAddress(addresses[0]) : 'Unknown Location'
  }
}

// Helper to format address
const formatAddress = (address: any) => {
  const parts = [address.line?.join(', '), address.city, address.state, address.postalCode, address.country].filter(Boolean)

  return parts.join(', ') || 'Unknown Location'
}

export default function DashboardPage() {
  const { client, isLoading: clientLoading } = useFhirClient()
  const { patient, error: patientError, loading: patientLoading } = usePatient(client)

  const patientDetails = extractPatientDetails(patient)

  const details = [
    { label: 'Phone Number', value: patientDetails.phone },
    { label: 'Email', value: patientDetails.email },
    { label: 'Date of Birth', value: patientDetails.dob },
    { label: 'Location', value: patientDetails.address }
  ]

  // Show loading state
  if (clientLoading || patientLoading) {
    return (
      <main className="space-y-12">
        <Card className="w-full p-2">
          <CardBody>
            <div className="flex justify-center items-center h-48">
              <p>Loading patient information...</p>
            </div>
          </CardBody>
        </Card>
      </main>
    )
  }

  // Show error state
  if (patientError) {
    return (
      <main className="space-y-12">
        <Card className="w-full p-2">
          <CardBody>
            <div className="flex flex-col justify-center items-center h-48">
              <p className="text-danger">Error loading patient information</p>
              <p>{patientError}</p>
            </div>
          </CardBody>
        </Card>
        <MedicationManagementCard />
      </main>
    )
  }

  return (
    <main className="space-y-12">
      <Card className="w-full p-2">
        <CardBody className="flex flex-row gap-4">
          <div className="col-span-1 w-[10rem] md:w-[12rem] h-[10rem] md:h-[12rem] gap-8 flex flex-col items-center justify-center">
            <Avatar size="lg" radius="lg" className="aspect-square w-full h-full bg-content2 text-content2-foreground">
              <UserIcon />
            </Avatar>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-3xl md:text-4xl font-bold">{patientDetails.name}</h1>
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
      <MedicationManagementCard />
    </main>
  )
}
