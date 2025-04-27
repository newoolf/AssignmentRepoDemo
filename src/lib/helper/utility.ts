import { PatientDetails } from '@/types'

// Helper to Safely extract patient details
export const extractPatientDetails = (patient: any): PatientDetails => {
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

export const formatAddress = (address: any) => {
  const parts = [address.line?.join(', '), address.city, address.state, address.postalCode, address.country].filter(Boolean)

  return parts.join(', ') || 'Unknown Location'
}

// Process medication bundle into displayable medication data
export const processMedicationBundle = (medicationRequestBundle: any) => {
  const processedMeds: any[] = []

  medicationRequestBundle.entry?.forEach((entry: any) => {
    const resource = entry.resource
    let name = 'Unknown Medication'
    let dose = 'as directed'
    let instructions = ''
    let frequency = ''

    if (resource.medicationCodeableConcept?.coding?.[0]?.display) {
      name = resource.medicationCodeableConcept.coding[0].display
    } else if (resource.medicationCodeableConcept?.text) {
      name = resource.medicationCodeableConcept.text
    } else if (resource.medicationReference?.display) {
      name = resource.medicationReference.display
    }

    const dosageInstruction = resource.dosageInstruction?.[0]
    if (dosageInstruction?.doseAndRate?.[0]?.doseQuantity) {
      const dq = dosageInstruction.doseAndRate[0].doseQuantity
      dose = `${dq.value}${dq.unit || ''}`
    } else if (dosageInstruction?.text) {
      dose = dosageInstruction.text
    }

    if (dosageInstruction?.timing?.code?.text) {
      frequency = dosageInstruction.timing.code.text
    }

    instructions = dosageInstruction?.patientInstruction || ''

    processedMeds.push({
      id: resource.id,
      name,
      dose,
      frequency,
      instructions,
      resource // Keep the original resource for removal
    })
  })

  return processedMeds
}
