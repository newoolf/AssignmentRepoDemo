import { Card, CardBody } from '@heroui/card'
import { Divider } from '@heroui/react'
import { Accordion, AccordionItem } from '@heroui/react'
import { Button } from '@heroui/button'
import { PlusIcon, TrashIcon } from '@/components/icons'
import React from 'react'
import Image from 'next/image'
import { MedicationData } from '@/types'

interface MedicationsListProps {
  medications: MedicationData[]
  medicationsLoading: boolean
  medicationsError: string | null
  medicationBundle: any
  dbError: string | null
  onRemoveMedication: (id: string) => void
  onOpenAddModal: () => void
  onAddToNotifications: () => void
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  medications,
  medicationsLoading,
  medicationsError,
  medicationBundle,
  dbError,
  onRemoveMedication,
  onOpenAddModal,
  onAddToNotifications
}) => {
  return (
    <Card className="w-full p-2">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Patient's Medications</h2>
            <div className="ml-4">
              <Image src="/orangepillbottle.jpg" alt="Pill Bottle" width={50} height={50} className="rounded-md shadow-sm" />
            </div>
          </div>
          <Button color="success" radius="full" isIconOnly onClick={onOpenAddModal} aria-label="Add medication">
            <PlusIcon />
          </Button>
        </div>

        <Divider className="mb-4" />

        {medicationsLoading ? (
          <p>Loading medications...</p>
        ) : medicationsError ? (
          <p className="text-danger">Error loading medications: {medicationsError}</p>
        ) : medications.length === 0 ? (
          <p>No medications found</p>
        ) : (
          <>
            <Accordion variant="splitted" className="mb-6">
              {medications.map((medication) => (
                <AccordionItem
                  key={medication.id}
                  aria-label={`Medication ${medication.name} ${medication.dose}`}
                  title={`${medication.name} ${medication.dose}`}
                  subtitle={medication.frequency}
                  className="bg-content2"
                  endContent={
                    <Button
                      color="danger"
                      variant="light"
                      isIconOnly
                      onClick={(e) => {
                        e.stopPropagation() // Prevent accordion from toggling
                        onRemoveMedication(medication.id)
                      }}
                      aria-label="Remove medication"
                    >
                      <TrashIcon />
                    </Button>
                  }
                >
                  <div className="p-2">
                    <p>
                      <span className="font-semibold">Dosage:</span> {medication.dose}
                    </p>
                    {medication.frequency && (
                      <p className="mt-2">
                        <span className="font-semibold">Frequency:</span> {medication.frequency}
                      </p>
                    )}
                    {medication.instructions && (
                      <p className="mt-2">
                        <span className="font-semibold">Instructions:</span> {medication.instructions}
                      </p>
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>

            <button
              type="button"
              className="mt-4 bg-success text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-success-600 transition"
              onClick={onAddToNotifications}
              disabled={!medicationBundle}
            >
              Add medications to notification list
            </button>

            {dbError && <p className="text-danger mt-2">{dbError}</p>}
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default MedicationsList
