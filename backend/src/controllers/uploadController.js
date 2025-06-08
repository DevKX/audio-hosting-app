const { BlobServiceClient } = require('@azure/storage-blob');
const { generateAudioFileName } = require('../services/fileNameService');
const mm = require('music-metadata'); // Add this line

exports.uploadAudio = async (req, res) => {
  try {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_BLOB_CONTAINER;

    if (!AZURE_STORAGE_CONNECTION_STRING || !containerName) {
      return res.status(500).json({ error: "Azure storage config missing" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // validate file size
    if (req.file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 50MB limit" });
    }

    // Generate a new file name
    const username = req.user?.username || "unknown";
    const generatedFileName = generateAudioFileName(req.file.originalname, username);

    // Get audio duration using music-metadata
    let duration_seconds = null;
    try {
      const metadata = await mm.parseBuffer(req.file.buffer, req.file.mimetype);
      duration_seconds = metadata.format.duration ? Math.round(metadata.format.duration) : null;
    } catch (err) {
      console.warn("Could not extract duration:", err.message);
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(generatedFileName);
    await blockBlobClient.uploadData(req.file.buffer);

    // Get additional metadata from req.body if sent from frontend
    const { title, description, is_public, category } = req.body;

    res.status(201).json({
      message: "File uploaded successfully",
      fileUrl: blockBlobClient.url,
      filename: generatedFileName,
      title,
      description,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      duration_seconds,
      is_public: is_public === 'true' || is_public === true,
      category
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to upload file" });
  }
};

exports.deleteAudio = async (req, res) => {
  try {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_BLOB_CONTAINER;
    const { filename } = req.params; 

    if (!AZURE_STORAGE_CONNECTION_STRING || !containerName) {
      return res.status(500).json({ error: "Azure storage config missing" });
    }
    if (!filename) {
      return res.status(400).json({ error: "No filename provided" });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    await blockBlobClient.deleteIfExists();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete file" });
  }
};