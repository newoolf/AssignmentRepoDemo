"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { useFhirClient } from "@Components/FHIR/FHIRClientProvider";

export default function AddMedicationPage() {
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notes, setNotes] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const router = useRouter();
  const { client: fhirClient } = useFhirClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!fhirClient) {
        console.error("FHIR client is not initialized.");
        return;
      }

      const patient = await fhirClient.patient.read();
      const patientId = patient.id;

      const newMedicationRequest = {
        resourceType: "MedicationRequest",
        status: "active",
        intent: "order",
        subject: {
          reference: `Patient/${patientId}`,
        },
        medicationCodeableConcept: {
          text: medicationName,
        },
        dosageInstruction: [
          {
            text: `${dosage}, ${frequency}, Reminder at ${reminderTime}`,
          },
        ],
        note: notes ? [{ text: notes }] : [],
      };

      const response = await fhirClient.create({
        resource: newMedicationRequest,
      });

      console.log("FHIR MedicationRequest created:", response);
      router.push("/dashboard");
    } catch (err) {
      // console.error("Error creating MedicationRequest:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Medication</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Medication Name</label>
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dosage</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Time (EST)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Add Medication
          </button>
        </form>
      </div>
    </div>
  );
}
