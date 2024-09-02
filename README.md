# Email Sender with Attachments

This project is a Node.js script designed to send emails with attachments (PDFs, images, videos) using Nodemailer. The script reads email addresses from an Excel file, retrieves the message and subject from text files, and includes any attachments found in a specified directory. It supports batch processing to manage email sending limits and can be containerized using Docker.

## Features

- **Send Emails**: Includes multiple attachments (PDFs, images, videos).
- **Read Email Addresses**: Extracts from an Excel file.
- **Read Email Content**: Retrieves subject and message from text files.
- **Batch Processing**: Manages email sending in batches to avoid rate limits.
- **Docker Support**: Containerization for easy deployment.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **Docker** (Optional): For containerization.

## Setup

### 1. Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```
- Install Dependencies

- Install the required Node.js dependencies:

```sh
npm install
Prepare Files
```
- Ensure you have the following files in the specified directory:

- Excel File: contacts.xlsx (Excel file with email addresses)
Text Files:
- message.txt (Text file with the email message)
- subject.txt (Text file with the email subject)
- Attachments: PDF, images, videos (stored in the files directory)
### Notice: The destination directory must contain:

1. An Excel file named contacts.xlsx
2. A text file named message.txt
3. A text file named subject.txt
##### These files are required for the script to function correctly.

### Environment Variables

- Create a .env file in the root of the project with the following content:

#### .env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
> Replace your-email@gmail.com and your-app-password with your Gmail address and app-specific password. ```

Running the Script
- To run the script locally:

``` sh
node index.js
To run the script using Docker:
```
- Build the Docker Image

```sh
docker build -t sentemail_excel .
```
- Run the Docker Container

```sh
docker run -v /path/to/host/directory:/usr/src/app/files -e GMAIL_USER=your-email@gmail.com -e GMAIL_PASS=your-app-password sentemail_excel
```
- Adjust the volume mapping and environment variables as needed.

#### Troubleshooting
- File Not Found Error:

> Ensure the files (contacts.xlsx, message.txt, subject.txt) are correctly placed in the directory specified by the volume mapping.

- Email Sending Issues:

> Verify that your Gmail account is configured to allow less secure apps or use an app-specific password if 2FA is enabled.

- Container File Access:

>Use the following command to inspect file access within the Docker container:

``` sh
docker run -it --rm -v /path/to/host/directory:/usr/src/app/files sentemail_excel sh
```
> Check the presence of files in /usr/src/app/files.

License
This project is licensed under the MIT License - see the LICENSE file for details.
