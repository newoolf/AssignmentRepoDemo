import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}
export interface PatientDetails {
  name: string
  phone: string
  email: string
  dob: string
  address: string
}
export interface MedicationData {
  id: string
  name: string
  dose: string
  frequency: string
  instructions: string
  resource: any // Original FHIR resource
  taken?: boolean // For medication tracking
}
export interface AddMedicationFormData {
  medicationName: string
  dosage: string
  frequency: string
  notes: string
  reminderTime: string
}
