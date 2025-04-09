"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { useMedication } from "@Lib/api/MedicationService";
import { usePatient } from "@Lib/api/PatientService";

export default function UserProfilePage() {
  const [patientData, setPatientData] = useState<string>(
    "Patient data will be displayed here after login."
  );
  const [medications, setMedications] = useState<string[]>(["Entry 1", "Entry 2"]);
  const [fhirClient, setFhirClient] = useState<any>(null);

  const { medication, error, loading } = useMedication(fhirClient);


  useEffect(() => {
    // Dynamically load the FHIR client library and set up client
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      const client = await FHIR.oauth2.ready();
      setFhirClient(client);
    };
    loadFHIRClient();
  }, []); // This only runs once when the component mounts

  /*
  useEffect(() => {
    // Only proceed once FHIR client and medication data are ready
    if (fhirClient) {
      if (loading) {
        console.log("Loading medications...");
      } else if (error) {
        console.error("Error fetching medications:", error);
        setPatientData("Error fetching medications.");
      } else {
        // Process and display the medication data
        ;
      }
    }
  }, [fhirClient]); // Trigger when fhirClient, medication, error, or loading changes
  */

  useEffect(() => {
    // Optionally handle patient data
	console.log("THE INSANE WILL SURVIVE");
    if (medication) {
		console.log("I AM GOING INSANE");
      // Set patient data when it's loaded (example of how you might display patient data)
		console.log("full json", medication)
		const medicationList = [];
		const medicationListURL = medication.entry.map((entry) => entry.fullUrl)
		console.log("Medication List: ", medicationListURL);
		const medicationImport = async () => {
			for (const entry of medicationListURL) {
				console.log("Medication Entry: ", entry);
				const medicationStatement = await fetch(entry).then((medication) => {
					return medication.json();
				})
				.then((medication) => {
					console.log("Medication Statement: ", medication);
					medicationList.push(medication.medicationCodeableConcept.coding[0].display);
				})
			}
		}
		medicationImport();
		console.log("Medication List after import: ", medicationList);
		setMedications(medicationList);
	  
	}
  }, [medication, error, loading]);

  return (
    <div>
      <p className={title()}>Login successful</p>
      {/* Display patient data */}
      <ul>
        {medications}
      </ul>
    </div>
  );
}
