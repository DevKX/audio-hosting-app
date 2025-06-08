# Audio-hosting-app

This project allows users to upload and playback audio.

---

# Features
- **User management:** Administrators can create, update, and delete users.
- **Audio upload:** Users can upload audio files to a cloud environment.
- **Audio management:** Users can view and playback uploaded audio files.


# Prerequisites
Create a `.env` file inside the `/backend` directory with the following variables:

```env
# DB configuration for the audio hosting application
DB_HOST=
DB_USER=
DB_PASSWORD_BASE64=
DB_NAME=
DB_PORT=
DB_SSL_CA_PATH=

# Azure Blob Storage configuration
AZURE_STORAGE_CONNECTION_STRING=
AZURE_BLOB_CONTAINER=
AZURE_STORAGE_ACCOUNT_NAME=

# SAS generation for audio files access
AZURE_STORAGE_ACCOUNT_KEY=

JWT_SECRET=

```

# Installation

###Clone the repo:
git clone https://github.com/DevKX/audio-hosting-app.git

###Navigate into project directory:
cd audio-hosting-app

###Docker compose:
docker compose build
docker compose up


# Usage
After the Docker containers are up, access the backend API at http://localhost:3000.

# License
This project is licensed under the MIT License. See the LICENSE file for details.
