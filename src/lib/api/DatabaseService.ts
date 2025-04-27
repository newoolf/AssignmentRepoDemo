import { useState, useEffect } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import type { fhirclient } from 'fhirclient/lib/types';
import { app } from '../firebase'; // Adjust the import path as needed

export const useAddPatient = () => {
    const [error, setError] = useState<string | null>(null);

    const addPatientToDB = async (
        patientId: string, 
        patientName: string, 
        patientEmail: string, 
        medications: fhirclient.FHIR.Bundle
    ) => {
        const db = getDatabase(app);
        const patientRef = ref(db, `patients/${patientId}`);

        // Convert medications array into an object with IDs like med1, med2, etc.
        const medicationsObject: { [key: string]: fhirclient.FHIR.Resource } = {};
        medications.entry?.forEach((entry, index) => {
            const med = entry.resource;
            medicationsObject[`${med.id}`] = {
                id: med.id,
                code: med.medicationCodeableConcept.text || med.medicationCodeableConcept.coding?.[0]?.display || 'Unknown Medication',
                status: med.status,
                asNeeded: med.dosageInstruction?.[0]?.asNeeded || false,
                dosageInstruction: med.dosageInstruction?.[0]?.text || 'No dosage instruction provided',
            };
        });

        const patientData = {
            id: patientId,
            name: patientName,
            email: patientEmail,
            medications: medicationsObject,
        };

        set(patientRef, patientData)
            .then(() => {
                console.log('Patient added successfully');
            })
            .catch((err) => {
                console.error('Error adding patient:', err);
                setError(`Failed to add patient: ${err.message}`);
            });
    }
    return { addPatientToDB, error};
};
