import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import React from 'react'
import { AddMedicationFormData } from '@/types'

interface AddMedicationModalProps {
  isOpen: boolean
  onClose: () => void
  formData: AddMedicationFormData
  onFormChange: {
    setMedicationName: (value: string) => void
    setDosage: (value: string) => void
    setFrequency: (value: string) => void
    setNotes: (value: string) => void
    setReminderTime: (value: string) => void
  }
  onSubmit: (e: React.FormEvent) => void
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onClose, formData, onFormChange, onSubmit }) => {
  const { medicationName, dosage, frequency, notes, reminderTime } = formData
  const { setMedicationName, setDosage, setFrequency, setNotes, setReminderTime } = onFormChange

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Medication</ModalHeader>
        <ModalBody>
          <form id="add-medication-form" onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medication Name</label>
              <input
                type="text"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reminder Time (EST)</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes/Instructions (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="success" type="submit" form="add-medication-form">
            Add Medication
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddMedicationModal
