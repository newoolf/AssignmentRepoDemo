"use client";
import { use, useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { useMedication } from "@Lib/api/MedicationService";
import { useAddPatient } from "@Lib/api/DatabaseService";
import { usePatient } from "@Lib/api/PatientService";
import { subtitle } from "@/components/primitives";
// biome-ignore lint/style/useImportType: <explanation>
import { fhirclient } from "fhirclient/lib/types";
import type Client from "fhirclient/lib/Client";


/**
 * UserProfilePage Component
 *
 * This component displays a user's profile information, including their name, date of birth, 
 * patient ID, and a list of their medications. It uses the FHIR client library to fetch 
 * patient and medication data from a FHIR server.
 *
 * ## Features:
 * - Dynamically loads the FHIR client library and initializes the client.
 * - Fetches and displays patient information such as name, date of birth, and ID.
 * - Fetches and displays a list of medications associated with the patient.
 * - Handles loading states and errors gracefully.
 *
 * ## State Variables:
 * - `medications`: An array of medication names fetched from the FHIR server.
 * - `fhirClient`: The initialized FHIR client instance.
 * - `fullName`: The patient's full name.
 * - `dob`: The patient's date of birth.
 * - `patient_id`: The patient's unique ID.
 *
 * ## Hooks:
 * - `useEffect`: 
 *   - Initializes the FHIR client on component mount.
 *   - Fetches and processes medication data when the `medication` object changes.
 *   - Fetches and processes patient data when the `patient` object changes.
 *
 * ## Dependencies:
 * - `useMedication`: Custom hook to fetch medication data from the FHIR server.
 * - `usePatient`: Custom hook to fetch patient data from the FHIR server.
 *
 * ## UI:
 * - Displays patient information in a styled card.
 * - Displays a list of medications in a bulleted list.
 * - Includes an image of a pill bottle for visual context.
 *
 * ## Error Handling:
 * - Displays fallback text if patient or medication data cannot be loaded.
 * - Logs errors to the console for debugging purposes.
 *
 * @returns A React component that renders the user's profile and medication information.
 */
export default function UserProfilePage() {
  const [medications, setMedications] = useState<string[]>([]);
  const [fhirClient, setFhirClient] = useState<Client | null>(null);
  const { medication, error, loading } = useMedication(fhirClient);
  const { patient, error: patientError, loading: patientLoading } = usePatient(fhirClient);
  const [fullName, setFullName] = useState<string>('');
  const [patient_id, setPatientId] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('Unknown Email');
  const { addPatientToDB } = useAddPatient();

  useEffect(() => {
    // Dynamically load the FHIR client library and set up client
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      const client = await FHIR.oauth2.ready();
      setFhirClient(client);
    };
    loadFHIRClient();
  }, []); // This only runs once when the component mounts

  useEffect(() => {
    if (medication) {
      const medicationImport = async () => {
        const medicationList: string[] = [];
  
        try {
          const medicationListURL = medication.entry?.map((entry: fhirclient.FHIR.BundleEntry) => entry.fullUrl) || [];
          for (const entry of medicationListURL) {
            const res = await fetch(entry);
            const data = await res.json();
            const displayName =
              data?.medicationCodeableConcept?.coding?.[0]?.display || "Unknown Medication";
            medicationList.push(displayName);
          }
  
          setMedications(medicationList); //Update  only after fetch is complete
        } catch (err) {
          console.error("Error fetching medication data:", err);
          setMedications(["Error loading medications"]);
        }
      };
  
      medicationImport(); 
    }
  }, [medication]);


  useEffect(() => {
    if (patient) {
      const patientImport = async () => {
        try {
          const patientName = `${patient.name?.[0]?.given?.join(" ")} ${patient.name?.[0].family}` || "Unknown Name";
          const patientID = `${patient.id}` || "Unknown ID";
          setFullName(patientName);
          setPatientId(patientID);
          
        } catch (err) {
          console.error("Error fetching patient data:", err);
          setFullName("Error loading patient name");
          setPatientId("Error loading patient ID");
        }
      };
  
      patientImport(); 
    }
  }, [patient]);


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientEmail(e.target.value);
  };

  return (
    <div className="bg-foreground min-h-screen flex flex-col items-center justify-start py-10 px-4">
      <div className="flex items-center space-x-4 mb-6">
      <p className={`text-gray-700 ${title()}`}>
        <span className={title()}>My</span>{' '}
        <span className="text-success"> Medication Info:</span>

        </p>
        <Image
          src="/orangepillbottle.jpg"
          alt="Pill Bottle"
          width={100}
          height={100}
          className="rounded-md shadow-md"
          />
        </div>      

      
       
      {/* Display patient data */}
    <div className="bg-foreground rounded-2xl shadow-lg p-6 w-full max-w-xl mb-6">
       <p className="text-black ${subtitle()}text-2xl font-bold mt-4"> Patient's Information:</p>
        <div className="text-gray-700 mb-1 space-y-1">
          <p><span className="font-medium">Name:</span> {fullName}</p>
          <p><span className="font-medium">Patient ID:</span> {patient_id}</p>
          <p className="text-xl font-bold mb-4">Enter Email:</p>
          <input
            type="email"
            value={patientEmail}
            onChange={handleEmailChange}
            placeholder="Enter patient's email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-xl shadow-md mt-2 h-999"> */}
      <div className="bg-foreground rounded-2xl shadow-lg p-3 w-full max-w-xl">
        <p className="text-xl font-bold mb-4">Patient's Medications:</p>
   
        <button
          type="button"
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition"
          onClick={() => addPatientToDB(patient_id, fullName, patientEmail, medication as fhirclient.FHIR.Bundle)}
        >
          Add medications to notification list:
        </button>
        <ul className="list-disc pl-4 space-y-2 text-gray-700">
          <p className="text-xl font-bold text-gray-700 mb-4">

          </p>
           {medications.map((med) => (
            <li key={med}>{med}</li>
          ))}
        </ul>
      </div>
      <ul> 
        {/* <p className={subtitle()}>Hello</p> */}
      </ul>
    </div>
  );
}
