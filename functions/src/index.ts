import { onDocumentCreated, FirestoreEvent, QueryDocumentSnapshot } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

// Secrets for SMTP authentication
const TITAN_USER = defineSecret("TITAN_SMTP_USER");
const TITAN_PASS = defineSecret("TITAN_SMTP_PASS");

admin.initializeApp();

/**
 * Triggered when a new document is created in the 'contactSubmissions' collection.
 * It determines the submission type, pulls the correct destination email from site settings,
 * and sends an email notification via Titan SMTP.
 */
export const onContactSubmissionCreated = onDocumentCreated({
  document: "contactSubmissions/{submissionId}",
  secrets: [TITAN_USER, TITAN_PASS],
  region: "us-central1", // Matching firestore location from firebase.json
}, async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { submissionId: string }>) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  const submissionId = event.params.submissionId;

  if (!data) {
    console.log(`Document ${submissionId} exists but has no data`);
    return;
  }

  console.log(`Processing submission ${submissionId} of type: ${data.type}`);

  try {
    // 1. Fetch Routing Settings from Firestore
    const settingsDoc = await admin.firestore().doc("siteSettings/contact").get();
    const settings = settingsDoc.exists ? settingsDoc.data() : {};

    // 2. Determine Destination Email
    let destEmail = "hello@lector.life"; // Default Fallback
    const type = data.type || "general";

    if (type === "partnership") {
      destEmail = settings?.partnershipsEmail || "partnerships@lector.life";
    } else if (type === "architect_application") {
      destEmail = settings?.architectsEmail || "architects@lector.life";
    } else if (type === "support") {
      destEmail = settings?.supportEmail || "support@lector.life";
    } else {
      destEmail = settings?.generalEmail || "hello@lector.life";
    }

    console.log(`Routing submission to: ${destEmail}`);

    // 3. Setup Nodemailer Transport
    // Titan SMTP settings: smtp.titan.email, port 465 (SSL)
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: TITAN_USER.value(),
        pass: TITAN_PASS.value(),
      },
    });

    // 4. Construct Email Body (Clean & Readable HTML)
    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #6d28d9; margin-top: 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
          New Website Submission: ${type.toUpperCase().replace('_', ' ')}
        </h2>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Submission ID:</strong> <code style="background: #eee; padding: 2px 4px; border-radius: 4px;">${submissionId}</code></p>
          <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; width: 150px;"><strong>Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${data.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${data.email}">${data.email || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Subject:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${data.subject || 'No Subject'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <h3 style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px;">Message Contents:</h3>
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; white-space: pre-wrap;">
            ${data.message || 'No message content provided.'}
          </div>
        </div>

        ${renderAdditionalFields(data)}

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center;">
          This is an automated notification from LECTOR Platform.<br/>
          View entry in Firestore: <a href="https://console.firebase.google.com/project/${process.env.GCLOUD_PROJECT}/firestore/data/~2FcontactSubmissions~2F${submissionId}" style="color: #6d28d9;">Open Firebase Console</a>
        </div>
      </div>
    `;

    // 5. Send Email
    // Note: support@lector.life is used as sender (primary account) to ensure SMTP reliability.
    await transporter.sendMail({
      from: `"LECTOR System" <support@lector.life>`,
      to: destEmail,
      replyTo: data.email,
      subject: `[${type.toUpperCase()}] ${data.subject || 'New Submission'} - ${data.name}`,
      html: htmlBody,
    });

    console.log(`Successfully forwarded submission ${submissionId} to ${destEmail}`);

    // Mark as processed
    await snapshot.ref.update({
      emailForwarded: true,
      forwardedAt: admin.firestore.FieldValue.serverTimestamp(),
      forwardedTo: destEmail
    });

  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error);
  }
});

/**
 * Helper to render dynamic fields based on submission type
 */
function renderAdditionalFields(data: any): string {
  const fields: string[] = [];

  // Partnerships specific
  if (data.company) fields.push(`<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Organization:</strong></td><td>${data.company}</td></tr>`);
  if (data.partnershipType) fields.push(`<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Partnership Type:</strong></td><td>${data.partnershipType}</td></tr>`);

  // Architects specific
  if (data.country) fields.push(`<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Country:</strong></td><td>${data.country}</td></tr>`);
  if (data.category) fields.push(`<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Category:</strong></td><td>${data.category} / ${data.subcategory || ''}</td></tr>`);
  if (data.profileLink) fields.push(`<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Profile:</strong></td><td><a href="${data.profileLink}">${data.profileLink}</a></td></tr>`);
  if (data.whyStatus) fields.push(`<tr><td style="padding: 20px 0 10px 0;"><strong>Why Status:</strong></td><td>${data.whyStatus}</td></tr>`);
  
  if (fields.length === 0) return '';

  return `
    <div style="margin-top: 25px;">
      <h3 style="font-size: 14px; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px;">Additional Information:</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${fields.join('')}
      </table>
    </div>
  `;
}
