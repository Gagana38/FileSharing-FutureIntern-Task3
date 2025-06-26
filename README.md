# 🔐 Secure File Sharing System

A simple yet secure file sharing system built with **Node.js** that allows users to **upload and download files safely**, with a strong focus on **encryption and data confidentiality**. The project uses **AES-256-CBC encryption** to ensure files are protected both at rest and in transit.

---

## 🚀 Features

- 📁 Upload files securely via a web or API interface
- 📥 Download files only after AES decryption
- 🔒 Encrypts each file using a unique Initialization Vector (IV)
- 📦 Express + Multer for file handling
- 💾 Stores encrypted files and IVs in the `uploads/` directory
- 🧪 Tested with Postman and browser-based file forms

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Encryption**: `crypto` module with AES-256-CBC
- **File Upload**: Multer (in-memory)
- **Environment Config**: dotenv
- **Optional**: MongoDB (for metadata tracking - if added)

---

## 🔐 Security Details

- Files are **encrypted on upload** using AES-256-CBC
- An **IV (Initialization Vector)** is generated per file and stored separately
- Files are **decrypted only during download**
- Environment variables (`.env`) are used to store the secret key securely

---

## 📂 Project Structure
secure-file-sharing/
├── uploads/ # Encrypted files and IVs stored here
├── public/ # Frontend HTML (optional)
├── .env # Stores SECRET_KEY (not committed to Git)
├── server.js / app.js # Main server file
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/secure-file-sharing.git

2. Install dependencies
cd secure-file-sharing
npm install

3. Set environment variables

    Create a .env file in the root:
   SECRET_KEY=12345678901234567890123456789012
   Must be exactly 32 characters long for AES-256 encryption.
4. Create uploads/ directory
    mkdir uploads
5. Start the server
    node server.js
6. Test in browser or Postman

   Upload: POST /upload (form-data with key file)

   Download: GET /download/:filename
📄 License
This project is open-source and available under the MIT License.

🙋‍♂️ Author
Gagana GA
Cybersecurity & Node.js Enthusiast
LinkedIn • GitHub





