"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { writeFileSync } from 'fs';

export default function UserProfilePage() {
  const [patientData, setPatientData] = useState<string>(
    "Patient data will be displayed here after login."
  );
  const [medications, setMedications] = useState<string[]>([]);
  
  useEffect(() => {
    // Dynamically load the FHIR client library
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      FHIR.oauth2
        .ready()
        .then((client) => {
          //get patient medication 
          client.request("MedicationRequest").then((medication) => {
            console.log("Medication data:", medication);
            // Update the screen with list of active medications
            if (medication.entry) {
              const activeMeds = medication.entry
                .filter(
                  (entry: { resource: { medicationCodeableConcept: { text: any; }; status: string; }; }) =>
                    entry.resource?.medicationCodeableConcept?.text &&
                    entry.resource?.status === "active" //Only keep active medications
                )
                .map((entry: { resource: { medicationCodeableConcept: { text: any; }; }; }) => entry.resource.medicationCodeableConcept.text);
            
              setMedications(activeMeds);
              setPatientData(JSON.stringify(activeMeds, null, 2)); //Display only active medications
            }
          });
        })
        .catch((error) => {
          console.error("Error initializing FHIR client:", error);
          setPatientData("Error fetching patient data.");
        });
        
    };

    loadFHIRClient();
  }, []);

  return (
    <div>
      <p className={title()}>Login successful</p>
      {/* Display patient data */}
      <pre id="patient-data">{patientData}</pre>

      {/* Display medications as a list */}
      <ul>
        {medications.map((med, index) => (
          <li key={index}>{med}</li>
        ))}
      </ul>
    </div>
  );
}

