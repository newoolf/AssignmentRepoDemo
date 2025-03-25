"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";

export default function userProfilePage() {
  const [patientData, setPatientData] = useState<string>("Patient data will be displayed here after login.");

  useEffect(() => {
    // Dynamically load the FHIR client library
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      FHIR.oauth2
        .ready()
        .then((client) => {
          client.request("Patient").then((patient) => {
            console.log("Patient data:", patient);

            // Update the state with the patient data
            setPatientData(JSON.stringify(patient, null, 2));
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
}
