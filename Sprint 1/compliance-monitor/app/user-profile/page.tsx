"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { writeFileSync } from 'fs';

export default function userProfilePage() {
  const [patientData, setPatientData] = useState<string>("Patient data will be displayed here after login.");
  const JSONToFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            JSONToFile(medication, "medication");
            // Update the state with the patient data
            setPatientData(JSON.stringify(medication, ));
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
      {/* Bind the patientData state to the <p> element */}
      <pre id="patient-data">{patientData}</pre>
    </div>
  );

  function replacer(key, value) {
    // Filtering out properties
    if (typeof value === "string") {
      return undefined;
    }
    return value;
  }
}
