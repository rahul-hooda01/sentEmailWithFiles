Email Sender with Attachments
This project is a Node.js script that sends emails with attachments (PDFs, images, videos) using Nodemailer. The script reads email addresses from an Excel file, a message from a text file, and includes any attachments found in a specified directory. It supports batch processing and can be containerized with Docker.

Features
Send emails with multiple attachments (PDFs, images, videos).
Read email addresses from an Excel file.
Read email subject and message from text files.
Batch processing of emails to avoid rate limits.
Docker support for easy deployment.
Prerequisites
Node.js (v18 or higher)
Docker (optional, for containerization)
Setup
Clone the Repository

sh
Copy code
git clone <repository-url>
cd <repository-directory>
Install Dependencies

Install the required Node.js dependencies:

sh
Copy code
npm install
Prepare Files

Ensure you have the following files in the specified directory:

Excel File: contacts.xlsx (Excel file with email addresses)
Text Files:
message.txt (Text file with the email message)
subject.txt (Text file with the email subject)
Attachments: PDF, images, videos (stored in the files directory)
Notice: The destination directory must contain:

An Excel file named contacts.xlsx
A text file named message.txt
A text file named subject.txt
These files are required for the script to function correctly.

Environment Variables

Create a .env file in the root of the project with the following content:

env
Copy code
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
Replace your-email@gmail.com and your-app-password with your Gmail address and app-specific password.

Running the Script
To run the script locally:

sh
Copy code
node index.js
To run the script using Docker:

Build the Docker Image

sh
Copy code
docker build -t sentemail_excel .
Run the Docker Container

sh
Copy code
docker run -v /path/to/host/directory:/usr/src/app/files -e GMAIL_USER=your-email@gmail.com -e GMAIL_PASS=your-app-password sentemail_excel
Adjust the volume mapping and environment variables as needed.

Troubleshooting
File Not Found Error:

Ensure the files (contacts.xlsx, message.txt, subject.txt) are correctly placed in the directory specified by the volume mapping.

Email Sending Issues:

Verify that your Gmail account is configured to allow less secure apps or use an app-specific password if 2FA is enabled.

Container File Access:

Use the following command to inspect file access within the Docker container:

sh
Copy code
docker run -it --rm -v /path/to/host/directory:/usr/src/app/files sentemail_excel sh
Check the presence of files in /usr/src/app/files.

License
This project is licensed under the MIT License - see the LICENSE file for details.