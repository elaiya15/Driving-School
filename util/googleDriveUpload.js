import { google } from "googleapis";
import { Readable } from "stream"; // ✅ Import Readable
import path from "path";
const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve("util/googleApiKey.json"), // Ensure this file exists
  scopes: ["https://www.googleapis.com/auth/drive"],
});
console.log("Authenticated as:", (await auth.getClient()).email);

const drive = google.drive({ version: "v3", auth });

// Define Google Drive Folder IDs
const FOLDER_IDS = {
  photo: "1fnYHDug_07V7Ejs6ndpYd4h-dIDHmj8p", //PROFILE_FOLDER_ID
  signature: "1DfCQr8w41kGutJJC9SYvGu_vHROjyxWz", //SIGNATURE_FOLDER_ID
  aadharCard: "1wliGViKRL4lzdna8CEt02H8IHy4sL09o", //AADHAR_FOLDER_ID
  educationCertificate: "1dNNS2V59gosltaBGf1Gl80hK4LShu0m7", //EDUCATION_FOLDER_ID
  passport: "1x9irWfXLDdTX-OjQcCmXl40SJ5SlEpqr", //PASSPORT_FOLDER_ID
  notary: "1o50JpIWBy30wqrYfEwFuLv-4jleCXrrf", //NOTARY_FOLDER_ID
};

/**
 * Uploads a file buffer to Google Drive.
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - Original file name
 * @param {string} fileType - Type of file (photo, signature, etc.)
 * @param {string} userIdentifier - Unique user identifier (username or ID)
 * @returns {string} - Google Drive file URL
 */
export const uploadFile = async (
  fileBuffer,
  fileName,
  fileType,
  userIdentifier
) => {
  try {
    const folderId = FOLDER_IDS[fileType];
    if (!folderId) throw new Error(`❌ Invalid file type: ${fileType}`);

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${userIdentifier}_${fileType}_${timestamp}_${fileName}`;

    // ✅ Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null); // End of the stream

    console.log(folderId);

    // return;
    // Upload new file
    const fileMetadata = {
      name: uniqueFileName,
      // parents: [`${folderId}`],
    };

    const media = {
      mimeType: "application/octet-stream", // Or use actual mimetype
      body: bufferStream, // ✅ Pass the readable stream instead of buffer
    };

    const uploadResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = uploadResponse.data.id;
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    console.log(`✅ fileId: ${fileId}`);
    console.log(`✅ fileUrl: ${fileUrl}`);
    console.log(`✅ Uploaded ${uniqueFileName} to Google Drive`);
    return fileUrl;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw error;
  }
};

const uploadResponse = await drive.files.create({
  resource: { name: "test_file.txt" },
  media: { mimeType: "text/plain", body: "Hello Google Drive!" },
  fields: "id", // Correct field name
});

console.log("Uploaded File ID:", uploadResponse.data.id);
