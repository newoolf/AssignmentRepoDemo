import { renderHook, act } from "@testing-library/react";
import { useAddPatient } from "../DatabaseService";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../../firebase";

// Mock Firebase modules
jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn()
}));

jest.mock("../../firebase", () => ({
  app: {}
}));

describe("DatabaseService", () => {
  const mockPatientData = {
    patientId: "123",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    medications: {
      entry: [
        {
          resource: {
            id: "med1",
            medicationCodeableConcept: {
              text: "Medication 1",
              coding: [{ display: "Med 1" }]
            },
            status: "active",
            dosageInstruction: [
              {
                asNeeded: false,
                text: "Take once daily"
              }
            ]
          }
        }
      ]
    }
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (set as jest.Mock).mockResolvedValue(undefined);
  });

  it("should add patient to database successfully", async () => {
    const { result } = renderHook(() => useAddPatient());
    
    await act(async () => {
      await result.current.addPatientToDB(
        mockPatientData.patientId,
        mockPatientData.patientName,
        mockPatientData.patientEmail,
        mockPatientData.medications as fhirclient.FHIR.Bundle
      );
    });

    expect(getDatabase).toHaveBeenCalledWith(app);
    expect(ref).toHaveBeenCalledWith(
      undefined,
      `patients/${mockPatientData.patientId}`
    );
    expect(set).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("should handle database errors", async () => {
    const errorMessage = "Database error";
    (set as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAddPatient());
    
    await act(async () => {
      await result.current.addPatientToDB(
        mockPatientData.patientId,
        mockPatientData.patientName,
        mockPatientData.patientEmail,
        mockPatientData.medications as fhirclient.FHIR.Bundle
      );
    });

    expect(result.current.error).toBe(`Failed to add patient: ${errorMessage}`);
  });

  it("should handle missing medication data gracefully", async () => {
    const { result } = renderHook(() => useAddPatient());
    
    const medicationsWithoutData = {
      entry: [
        {
          resource: {
            id: "med1",
            medicationCodeableConcept: {},
            status: "active",
            dosageInstruction: []
          }
        }
      ]
    };

    await act(async () => {
      await result.current.addPatientToDB(
        mockPatientData.patientId,
        mockPatientData.patientName,
        mockPatientData.patientEmail,
        medicationsWithoutData as fhirclient.FHIR.Bundle
      );
    });

    expect(set).toHaveBeenCalled();
    const setCall = (set as jest.Mock).mock.calls[0][1];
    expect(setCall.medications.med1.code).toBe("Unknown Medication");
    expect(setCall.medications.med1.dosageInstruction).toBe("No dosage instruction provided");
  });
});