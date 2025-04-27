'use client'

import React, { useState } from 'react'
import { usePatient } from '@Lib/api/PatientService'
import { useFhirClient } from '@/components/FHIR/FHIRClientProvider'
import { useAddPatient } from '@Lib/api/DatabaseService'
import { useMedicationData } from '@Components/medication/medication-data'
import { extractPatientDetails } from '@Lib/helper/utility'
import PatientInfoCard from '@Components/patient-info-card'
import MedicationsList from '@Components/medication/medication-list'
import AddMedicationModal from '@Components/medication/medication-modal'

export default function UserProfilePage() {
  const { client: fhirClient, isLoading: clientLoading } = useFhirClient()
  const { patient, error: patientError, loading: patientLoading } = usePatient(fhirClient)
  const { addPatientToDB, error: dbError } = useAddPatient()
  const [patientEmail, setPatientEmail] = useState<string>('Unknown Email')

  // Get medications data with hook //
  const {
    medications,
    medicationBundle,
    loading: medicationsLoading,
    error: medicationsError,
    addMedication,
    removeMedication
  } = useMedicationData(fhirClient, patient?.id)

  // Modal State //
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [medicationName, setMedicationName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [notes, setNotes] = useState('')
  const [reminderTime, setReminderTime] = useState('')

  const patientDetails = extractPatientDetails(patient)

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

  const openAddMedicationModal = () => {
    // Reset form
    setMedicationName('')
    setDosage('')
    setFrequency('')
    setNotes('')
    setReminderTime('')
    setIsAddModalOpen(true)
  }

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!fhirClient || !patient?.id) {
        console.error('FHIR client is not initialized or patient ID not available.')
        return
      }

      const newMedicationRequest = {
        resourceType: 'MedicationRequest',
        status: 'active',
        intent: 'order',
        subject: {
          reference: `Patient/${patient.id}`
        },
        medicationCodeableConcept: {
          text: medicationName
        },
        dosageInstruction: [
          {
            text: `${dosage}, ${frequency}, Reminder at ${reminderTime}`
          }
        ],
        note: notes ? [{ text: notes }] : []
      }

      await addMedication(newMedicationRequest)
      setIsAddModalOpen(false)
    } catch (err) {
      console.error('Error creating MedicationRequest:', err)
    }
  }

  const handleRemoveMedication = async (medicationId: string) => {
    try {
      await removeMedication(medicationId)
    } catch (err) {
      console.error('Error removing medication:', err)
    }
  }

  // Show loading state //
  if (clientLoading || patientLoading) {
    return (
      <main className="space-y-12">
        <div className="w-full p-4 bg-white shadow rounded-lg">
          <div className="flex justify-center items-center h-48">
            <p>Loading patient information...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error state //
  if (patientError) {
    return (
      <main className="space-y-12">
        <div className="w-full p-4 bg-white shadow rounded-lg">
          <div className="flex flex-col justify-center items-center h-48">
            <p className="text-danger">Error loading patient information</p>
            <p>{patientError}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-12">
      {/* Patient Information Card */}
      <PatientInfoCard patientDetails={patientDetails} patientId={patient?.id} patientEmail={patientEmail} onEmailChange={handleEmailChange} />

      {/* Medications List */}
      <MedicationsList
        medications={medications}
        medicationsLoading={medicationsLoading}
        medicationsError={medicationsError}
        medicationBundle={medicationBundle}
        dbError={dbError}
        onRemoveMedication={handleRemoveMedication}
        onOpenAddModal={openAddMedicationModal}
        onAddToNotifications={handleAddToNotifications}
      />

      {/* Add Medication Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={{
          medicationName,
          dosage,
          frequency,
          notes,
          reminderTime
        }}
        onFormChange={{
          setMedicationName: (value) => setMedicationName(value),
          setDosage: (value) => setDosage(value),
          setFrequency: (value) => setFrequency(value),
          setNotes: (value) => setNotes(value),
          setReminderTime: (value) => setReminderTime(value)
        }}
        onSubmit={handleAddMedication}
      />
    </main>
  )
}
