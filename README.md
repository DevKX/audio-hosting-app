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

### Clone the repo:
git clone https://github.com/DevKX/audio-hosting-app.git

### Navigate into project directory:
cd audio-hosting-app

### Docker compose:
docker compose build
docker compose up

# System Architecture
![image](https://github.com/user-attachments/assets/1f38c981-91b5-4ff6-a08b-9e5d5857e32d)

# Technical Design

### Backend
Decoupled API configuration to ensure the Audio Hosting App backend can be further developed into a microservices setup, where:

*	Each core function (Authentication, user management, audio upload, audio data can be separated into independent services.
*	Stateless authentication using JWT, enabling secure, scalable session management without server-side session storage.
*	If server-side session management is used, an application load balancer with sticky session (session affinity) is required to ensure a user’s request are always routed to same backend server or Kubernetes pods.



### Frontend

* Login Module
  * Validate username and password
  * Verify if user active status
  * Set JWT Token at localStorage
  * Set currentLogonUser (For Welcome message and setting of audio uploaded by column)
  
* Dashboard Module
  * Centralizes and manages all API interactions after login
  * Periodically fetches user and audio files to ensure IO in sync with the server and other user actions
  * Fetching of audio files will cause SAS URL to refresh (Validate for 15 min)
  * Control tab navigation
  * Handles error and success messages via a console/message component
  
* User Module
  * Populate selected user information into user form for update and delete
  * UserList - Display list of users, create, update and delete buttons
  * UserListItem – Display user item for user list
  * UserForm - Display and support create, update or delete user (Read only for delete)
  
* Audio Module
  *	Chaining API calls for Audio file upload and audio metadata upload (To support decoupled backend API)
  *	Upon failed audio metadata upload, an API call to delete the uploaded audio file will be fired to delete the Audio file from Azure Blob Storage. This is to maintain data integrity between audio files (Azure Blob storage) and audio metadata (DB)
  *	Audiolist - Display list of Audio list item
  *	AudioListItem
    *	Display list of Audio files metadata and SAS URL
    * Hover over audio file title to see audio metadata
	  * To perform playback, set playback speed and download of audio file
  *	AudioUpload – Display form to support audio file attachment and audio metadata

# Screenshot

### Dashboard


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
