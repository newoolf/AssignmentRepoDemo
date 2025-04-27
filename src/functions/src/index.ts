/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import {getDatabase, ref, get} from "firebase/database";
import {app} from "../../lib/firebase";
import {useMail} from "../../lib/api/MailService";
import {onSchedule} from "firebase-functions/v2/scheduler";

exports.sendEmailsScheduled =
onSchedule("every day 00:00", (async (event) => {
  const db = getDatabase(app);
  const reference = ref(db, "patients");
  const data = await get(reference);
  const jsData = data.val();
  const patients: Patient[] = Object.values(jsData);

  interface Patient {
    id: string;
    name: string;
    email: string;
    medications: {
      [key: string]: {
        code: string;
        status: string;
        asNeeded: boolean;
        dosageInstruction: string;
      };
    };
  }

  interface Medication {
    code: string;
    status: string;
    asNeeded: boolean;
    dosageInstruction: string;
  }

  for (const patient of patients) {
    const medications: Medication[] = Object.values(patient.medications);
    const filteredMedications =
     medications.filter((med) => med.status !== "stopped");
    const emailBody = `
      <h1>Medication Reminder</h1>
      <p>Dear ${patient.name},</p>
      <p>This is a reminder to take your medications:</p>
      <ul>
        ${filteredMedications
    .map((med) => `<li>${med.code} - ${med.dosageInstruction}</li>`)
    .join("")}
      </ul>
      <p>Best regards,</p>
      <p>Med Adherence System</p>
    `;
    const emailSubject = "Medication Reminder";
    const emailTo = patient.email;
    useMail(emailTo, emailSubject, emailBody);
    console.log(`Sending email to ${emailTo} with subject: ${emailSubject}`);
  }
  return;
}));
