"use client"
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";

export default function userProfilePage() {
  useEffect(() => {
    // Dynamically load the FHIR client library
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      FHIR.oauth2.ready().then((client) => {
        client.request("Patient").then((patient) => {
          console.log("Patient data:", patient);
        });
      }).catch((error) => {
        console.error("Error initializing FHIR client:", error);
      });
    };

    loadFHIRClient();
  }, []);

  return (
    <div>
      <p className={title()}>Login succesful</p>
      <p id="patient-data">Patient data will be displayed here after login.</p>
    </div>
  );
}
