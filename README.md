# Audio Hosting App

This project allows users to upload and playback audio files in a secure, cloud-hosted environment.

---

## Features

- **User Management:** Administrators can create, update, and delete users.
- **Audio Upload:** Users can upload audio files to Azure Blob Storage.
- **Audio Management:** Users can view and playback uploaded audio files securely using time-limited SAS URLs.

---

## Technology Stack

- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Node.js, Express, PostgreSQL
- **Cloud:** Azure Blob Storage, Azure VM
- **Containerization:** Docker, Docker Compose
- **Authentication:** JWT

---

## Prerequisites

Create a `.env` file inside the `/backend` directory with the following variables:

```env
# Database configuration
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

# JWT Secret
JWT_SECRET=

```

## Installation

Clone the repo:
git clone https://github.com/DevKX/audio-hosting-app.git

Navigate into project directory:
cd audio-hosting-app

Docker compose:
docker compose build
docker compose up

## System Architecture
![image](https://github.com/user-attachments/assets/a691f921-bc3c-4ccd-be2e-69040a5931d3)



## Technical Design

### Backend

The API is decoupled to support future microservices architecture, allowing each major function to be independently deployed and scaled. Key backend design choices include:

- Each core function (authentication, user management, audio upload, audio metadata) can be separated into independent services.
- Stateless authentication using JWT enables secure, scalable session management without requiring server-side session storage.
- If server-side session management is used, an application load balancer with sticky sessions (session affinity) is required to ensure a user's requests are routed to the same backend server or Kubernetes pod.

---

### Frontend

#### Login Module
- Validates username and password input.
- Verifies user active status.
- Stores JWT token in `localStorage`.
- Sets `currentLogonUser` for display (e.g. welcome message, filtering uploaded audio).

#### Dashboard Module
- Centralizes all API interactions after login.
- Periodically fetches user and audio file data to maintain sync with server actions.
- Automatically refreshes SAS URLs for audio files (valid for 15 minutes).
- Manages tab navigation.
- Displays errors and success messages via console/message components.

#### User Module
- Populates selected user info into the form for update or delete actions.
- **Components:**
  - `UserList`: Displays list of users with create, update, and delete buttons.
  - `UserListItem`: Displays individual user entries.
  - `UserForm`: Supports create, update, and delete operations (read-only for delete).

#### Audio Module
- Chains API calls: first uploads the audio file, then stores audio metadata to support backend decoupling.
- If metadata upload fails, triggers a rollback API call to delete the uploaded audio file from Azure Blob Storage (ensures consistency).
- **Components:**
  - `AudioList`: Displays list of uploaded audio files.
  - `AudioListItem`: 
    - Shows metadata and SAS URLs.
    - On hover, reveals metadata.
    - Allows playback, speed adjustment, and file download.
  - `AudioUpload`: Provides form for uploading audio files and associated metadata.


## Screenshots

### Login Page
![image](https://github.com/user-attachments/assets/77b650eb-8aa3-4c2f-9b6e-3fde719e8567)



### User Management page
![image](https://github.com/user-attachments/assets/3f2c66ad-32ad-45bf-bc31-efb59d3f2ec9)



### Audio Management Page
![image](https://github.com/user-attachments/assets/2c01ccb5-d3f4-4fb9-9e7f-169ffdbc2e5a)


### Audio Upload Page
![image](https://github.com/user-attachments/assets/2a4f9fcb-9ce1-4292-8612-703e62605bd0)

# Usage
After the Docker containers are up, access the backend API at http://localhost:3000.

# License
This project is licensed under the MIT License. See the LICENSE file for details.
