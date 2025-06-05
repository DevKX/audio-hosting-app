const pool = require('../db');
// Not needed as the filename is has been sanitized and generated in the uploadController
//const { generateAudioFileName } = require('../services/fileNameService');
const { generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } = require('@azure/storage-blob');

exports.createAudio = async (req, res) => {
  const user_id = req.user.id;
  const {
    title,
    description,
    filename, // <-- Use the already generated filename from the request
    file_path,
    mime_type,
    file_size,
    duration_seconds,
    is_public,
    category
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO audio_files (
        user_id, title, description, filename, file_path, mime_type, file_size, duration_seconds, is_public, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        user_id, // User id from JWT token
        title,
        description,
        filename, // Use the filename passed in the request
        file_path,
        mime_type,
        file_size,
        duration_seconds,
        is_public ?? false,
        category
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert audio metadata" });
  }
};

exports.deleteAudio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM audio_files WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Audio file not found" });
    }
    res.json({ message: "Audio file deleted", audio: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete audio file" });
  }
};

exports.listAudio = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_role = req.user.role; // Make sure your JWT includes the user's role
    console.log(`User ID: ${user_id}, Role: ${user_role}`);

    let query = `
      SELECT audio_files.*, users.username AS uploaded_by
      FROM audio_files
      JOIN users ON audio_files.user_id = users.id
    `;
    let params = [];

    if (user_role !== "admin") {
      query += " WHERE audio_files.user_id = $1";
      params.push(user_id);
      if (req.query.is_public) {
        query += ' AND audio_files.is_public = $2';
        params.push(req.query.is_public === 'true');
      }
    } else {
      // Admin: show all, but allow filtering by is_public if provided
      if (req.query.is_public) {
        query += ' WHERE audio_files.is_public = $1';
        params.push(req.query.is_public === 'true');
      }
    }

    const result = await pool.query(query, params);

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_BLOB_CONTAINER;
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const audioFilesWithSas = result.rows.map(audio => {
      if (!audio.is_public) {
        return { ...audio, sasUrl: null };
      }
      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName: audio.filename,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 15 * 60 * 1000),
        protocol: SASProtocol.Https,
      }, sharedKeyCredential).toString();

      const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${audio.filename}?${sasToken}`;
      return { ...audio, sasUrl };
    });

    res.json(audioFilesWithSas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch audio files" });
  }
  };


  // Generate a SAS URL for downloading an audio file
exports.getSasUrl = async (req, res) => {
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_BLOB_CONTAINER;
    const { filename } = req.params;

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const sasToken = generateBlobSASQueryParameters({
      containerName,
      blobName: filename,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      protocol: SASProtocol.Https,
    }, sharedKeyCredential).toString();

    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${filename}?${sasToken}`;
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate SAS URL" });
  }
};