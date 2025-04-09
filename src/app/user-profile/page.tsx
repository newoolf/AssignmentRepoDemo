"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { writeFileSync } from 'fs';
import { useMedication } from "@Lib/api/MedicationService";

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
          const {medication, error, loading} = useMedication(client)
          if (error) {
            console.error("Error fetching medications:", error);
            setPatientData("Error fetching medications.");
          } else if (loading) {
            console.log("Loading medications...");
          } else {
            // Process and display the medication data
            const medicationList = medication?.entry?.map((entry) => entry.resource.code.text) || [];
            setMedications(medicationList);
          }
          //client.request("MedicationRequest").then((medication) => {});
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

