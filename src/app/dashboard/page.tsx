'use client'

import { Card, CardBody } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { UserIcon } from '@/components/icons'
import { Divider } from '@heroui/react'
import { usePatient } from '@Lib/api/PatientService'
import { useEffect, useState } from 'react'
import MedicationManagementCard from '@Components/medication-management-card'

export default function DashboardPage() {
  const [fhirClient, setFhirClient] = useState<any>(null)
  const { patient, error: patientError, loading: patientLoading } = usePatient(fhirClient)

  // TODO: get actual user data from FHIR
  const [patientName, setFullName] = useState<string>('')
  const [patientAddress, setAddress] = useState<string>('')
  const [patientPhone, setPhone] = useState<string>('')
  const [dob, setDOB] = useState<string>('')
  //const [gp, setGP] = useState<string>('')
  const [gpOrg, setGPOrg] = useState<string>('')

  // TODO: fix with relevant info from FHIR
  const details = [
    { label: 'Phone Number', value: patientPhone },
    { label: 'Email', value: 'Unknown' },
    { label: 'Date of Birth', value: dob },
    { label: 'Location', value: patientAddress }
  ]

  useEffect(() => {
    // Dynamically load the FHIR client library and set up client
    const loadFHIRClient = async () => {
      const FHIR = await import('fhirclient')
      const client = await FHIR.oauth2.ready()
      setFhirClient(client)
    }
    loadFHIRClient()
  }, []) // This only runs once when the component mounts

  useEffect(() => {
    if (patient) {
      const patientImport = async () => {
        try {
          const patientName = `${patient.name?.[0]?.given?.join(' ')} ${patient.name?.[0].family}` || 'Unknown Name'
          const patientAddress = `${patient.address?.[0]?.city}` || 'Unknown Location'
          const patientPhone = `${patient.telecom?.[0]?.value}` || 'Unknown Phone Number'
          const dob = `${patient.birthDate}` || 'Unknown Birth Date'

          setFullName(patientName)
          setPhone(patientPhone)
          setAddress(patientAddress)
          setDOB(dob)
        } catch (err) {
          console.error('Error fetching patient data:', err)
          setFullName('Error loading patient name')
          setPhone('Error loading patient phone number')
          setAddress('Error loading patient address')
          setDOB('Error loading patient date of birth')
        }
      }

      patientImport()
    }
  }, [patient])

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
              <h1 className="text-3xl md:text-4xl font-bold">{patientName}</h1>
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
