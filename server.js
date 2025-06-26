const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); //dotenv

const app = express();
const IV_LENGTH = 16; //IV
const PORT = 3000;

// AES Key & IV — store securely in production!
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV = crypto.randomBytes(16);             // 128-bit IV

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Encrypt file buffer using AES-256-CBC
function encrypt(buffer) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

// Decrypt buffer
function decrypt(buffer) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
}

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const encryptedBuffer = encrypt(req.file.buffer);
  const filePath = path.join(uploadDir, req.file.originalname + '.enc');

  fs.writeFileSync(filePath, encryptedBuffer);
  res.send('File uploaded and encrypted successfully.');
});

// Download route
app.get('/download/:filename', (req, res) => {
  const encryptedPath = path.join(uploadDir, req.params.filename + '.enc');

  if (!fs.existsSync(encryptedPath)) {
    return res.status(404).send('File not found.');
  }

  const encryptedData = fs.readFileSync(encryptedPath);
  const decryptedBuffer = decrypt(encryptedData);

  res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
  res.send(decryptedBuffer);
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h2>Secure File Sharing</h2>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload & Encrypt</button>
    </form>
  `);
});

// Decrypt the file 

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const encPath = path.join(uploadDir, `${filename}.enc`);
  const ivPath = path.join(uploadDir, `${filename}.iv`);

  if (!fs.existsSync(encPath) || !fs.existsSync(ivPath)) {
    return res.status(404).send('File not found.');
  }

  try {
    const encryptedData = fs.readFileSync(encPath);
    const iv = fs.readFileSync(ivPath);
    const decrypted = decrypt(encryptedData, iv);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(decrypted);
  } catch (err) {
    console.error('Decryption error:', err);
    res.status(500).send('Failed to decrypt file.');
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
