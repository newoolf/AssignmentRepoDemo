"use client"
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";

export default function AuthPage() {
  useEffect(() => {
    // Dynamically load the FHIR client library
    const loadFHIRClient = async () => {
      const FHIR = await import("fhirclient");
      const clientID = "my_web_app";
      const scope = "openid fhirUser user/*.read"
      const redirectUri = "/user-profile"
      // Note: The redirectUri should point to the page where you want to handle the response after login
      FHIR.oauth2.authorize({ clientId: clientID, 
                              'scope': scope, 
                              'redirectUri': redirectUri,
                              iss: "https://launch.smarthealthit.org/v/r4/sim/WzMsImQ0ZmIzYmJhLTczYTktNGI4Mi1hMGJjLTY3OGQ0N2YzODZiNCIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMSwiIl0/fhir"
                            });
    };

    loadFHIRClient();
  }, []);

  return (
    <div>
    </div>
  );
}
