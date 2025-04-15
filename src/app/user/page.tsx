"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { useMedication } from "@Lib/api/MedicationService";
import { usePatient } from "@Lib/api/PatientService";
import { subtitle } from "@/components/primitives";
import Image from'next/image'


export default function UserProfilePage() {
  const [patientData, setPatientData] = useState<string>(
    "Patient data will be displayed here after login."
  );
  const [medications, setMedications] = useState<string[]>([]);
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
    if (medication) {
      const medicationImport = async () => {
        const medicationList: string[] = [];
  
        try {
          const medicationListURL = medication.entry?.map((entry) => entry.fullUrl) || [];
  
          for (const entry of medicationListURL) {
            const res = await fetch(entry);
            const data = await res.json();
            const displayName =
              data?.medicationCodeableConcept?.coding?.[0]?.display || "Unknown Medication";
            medicationList.push(displayName);
          }
  
          setMedications(medicationList); // ✅ Update state only after fetch is complete
        } catch (err) {
          console.error("Error fetching medication data:", err);
          setMedications(["Error loading medications"]);
        }
      };
  
      medicationImport(); // ✅ Awaiting happens inside here now
    }
  }, [medication]);
   [medication, error, loading];

  const fullName=''
  const dob=''
  const patient_id =''

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4">
      <div className="flex items-center space-x-4 mb-6">
      <p className={title()}>
        <span className="text-black">Login</span>{' '}
        <span className="text-green-500"> SUCCESSFUL!</span>

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
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl mb-6">
       <p className="text-black ${subtitle()}text-2xl font-bold mt-4"> Patient's Information:</p>
        <div className="text-gray-700 mb-1 space-y-1">
          <p><span className="font-medium">Name:</span> {fullName}</p>
          <p><span className="font-medium">Date of Birth:</span> {dob}</p>
          <p><span className="font-medium">Patient ID:</span> {patient_id}</p>
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-xl shadow-md mt-2 h-999"> */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl">
        <p className="text-xl font-bold text-black mb-4">Patient's Medications:</p>
   
        
        <ul className="list-disc pl-4 space-y-2 text-gray-700">
          
          
          {medications.map((med,index) => (
            <li key={index}>{med}</li>
          ))}
        </ul>
      </div>
      <ul> 
        {/* <p className={subtitle()}>Hello</p> */}
      </ul>
    </div>
  );
}
