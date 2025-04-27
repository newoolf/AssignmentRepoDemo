'use client'

import { Card, CardBody } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { Divider } from '@heroui/react'
import { UserIcon } from '@/components/icons'
import React, { useState } from 'react'
import { usePatient } from '@Lib/api/PatientService'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { useAddPatient } from '@Lib/api/DatabaseService'
import Image from 'next/image'
import type { fhirclient } from 'fhirclient/lib/types'

export default function UserProfilePage() {
  const { client: fhirClient, isLoading: clientLoading } = useFhirClient()
  const { patient, error: patientError, loading: patientLoading } = usePatient(fhirClient)
  const { addPatientToDB, error: dbError } = useAddPatient()

  // State for email input and medication data
  const [patientEmail, setPatientEmail] = useState<string>('Unknown Email')
  const [medicationBundle, setMedicationBundle] = useState<fhirclient.FHIR.Bundle | null>(null)
  const [medicationNames, setMedicationNames] = useState<string[]>([])
  const [medicationsLoading, setMedicationsLoading] = useState<boolean>(false)
  const [medicationsError, setMedicationsError] = useState<string | null>(null)

  // Extract patient details
  const patientDetails = extractPatientDetails(patient)

  // When component mounts or fhirClient changes, fetch medications
  React.useEffect(() => {
    if (!fhirClient || !patient?.id) return

    const fetchMedications = async () => {
      setMedicationsLoading(true)
      setMedicationsError(null)

      try {
        // Fetch medication requests directly as a Bundle
        const medicationRequestBundle = (await fhirClient.request(`MedicationRequest?subject=Patient/${patient.id}`)) as fhirclient.FHIR.Bundle

        // Store the raw bundle for use with database service
        setMedicationBundle(medicationRequestBundle)

        // Extract medication names for display
        const names: string[] = []
        medicationRequestBundle.entry?.forEach((entry) => {
          const resource = entry.resource
          let name = 'Unknown Medication'

          if (resource.medicationCodeableConcept?.coding?.[0]?.display) {
            name = resource.medicationCodeableConcept.coding[0].display
          } else if (resource.medicationCodeableConcept?.text) {
            name = resource.medicationCodeableConcept.text
          } else if (resource.medicationReference?.display) {
            name = resource.medicationReference.display
          }

          names.push(name)
        })

        setMedicationNames(names)
      } catch (err) {
        setMedicationsError(`Failed to fetch medications: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setMedicationsLoading(false)
      }
    }

    fetchMedications()
  }, [fhirClient, patient])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientEmail(e.target.value)
  }

  const handleAddToNotifications = () => {
    if (patient?.id && patientDetails.name && patientEmail && medicationBundle) {
      addPatientToDB(patient.id, patientDetails.name, patientEmail, medicationBundle)
    } else {
      console.error('Missing required information to add patient to database')
    }
  }

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
      </main>
    )
  }

  return (
    <main className="space-y-12">
      {/* Patient Information Card */}
      <Card className="w-full p-2">
        <CardBody className="flex flex-row gap-4">
          <div className="col-span-1 w-[10rem] md:w-[12rem] h-[10rem] md:h-[12rem] gap-8 flex flex-col items-center justify-center">
            <Avatar size="lg" radius="lg" className="aspect-square w-full h-full bg-content2 text-content2-foreground">
              <UserIcon />
            </Avatar>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-3xl md:text-4xl font-bold">{patientDetails.name}</h1>
            <p className="text-base md:text-lg">Patient ID: {patient?.id || 'Unknown ID'}</p>
            <Divider className="m-1" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Patient Details */}
              <div className="flex">
                <span className="font-semibold mr-2 text-sm md:text-base">Phone:</span>
                <span className="text-sm md:text-base">{patientDetails.phone}</span>
              </div>
              <div className="flex">
                <span className="font-semibold mr-2 text-sm md:text-base">Date of Birth:</span>
                <span className="text-sm md:text-base">{patientDetails.dob}</span>
              </div>
              <div className="flex">
                <span className="font-semibold mr-2 text-sm md:text-base">Location:</span>
                <span className="text-sm md:text-base">{patientDetails.address}</span>
              </div>

              {/* Email Input Field (Preserved functionality) */}
              <div className="flex flex-col col-span-1 sm:col-span-2 mt-4">
                <label htmlFor="email" className="font-semibold mb-2 text-sm md:text-base">
                  Email Address:
                </label>
                <input
                  id="email"
                  type="email"
                  value={patientEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter patient's email"
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Medications Card */}
      <Card className="w-full p-2">
        <CardBody>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold">Patient's Medications</h2>
            <div className="ml-4">
              <Image src="/orangepillbottle.jpg" alt="Pill Bottle" width={50} height={50} className="rounded-md shadow-sm" />
            </div>
          </div>

          <Divider className="mb-4" />

          {medicationsLoading ? (
            <p>Loading medications...</p>
          ) : medicationsError ? (
            <p className="text-danger">Error loading medications: {medicationsError}</p>
          ) : medicationNames.length === 0 ? (
            <p>No medications found</p>
          ) : (
            <>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                {medicationNames.map((med, index) => (
                  <li key={`med-${index}`} className="text-gray-700">
                    {med}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-4 bg-success text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-success-600 transition"
                onClick={handleAddToNotifications}
                disabled={!medicationBundle}
              >
                Add medications to notification list
              </button>

              {dbError && <p className="text-danger mt-2">{dbError}</p>}
            </>
          )}
        </CardBody>
      </Card>
    </main>
  )
}

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
