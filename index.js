const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const cron = require('node-cron');
require('dotenv').config();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
        logger: true, // Enable debug logging
        debug: true // Enable detailed debug logging
    },
});

// Path to the log file
const logFilePath = path.join(__dirname, 'processed_emails.json');

// Load processed emails from the log file
function loadProcessedEmails() {
    if (fs.existsSync(logFilePath)) {
        return new Set(JSON.parse(fs.readFileSync(logFilePath, 'utf-8')));
    }
    return new Set();
}

// Save processed emails to the log file
function saveProcessedEmails(processedEmails) {
    fs.writeFileSync(logFilePath, JSON.stringify([...processedEmails]));
}

// Get Email Addresses and Names from Excel
function getContacts(excelFilePath) {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    return data.map(row => ({ email: row.Email, name: row.Name || '' }));
}

// Get all files (PDFs, images, etc.) from the directory
function getFiles(directory) {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'];
    return fs.readdirSync(directory)
        .filter(file => allowedExtensions.includes(file.split('.').pop().toLowerCase()))
        .map(file => ({
            filename: file,
            path: path.join(directory, file),
        }));
}

// Send emails in batches
async function sendEmailsInBatches(contacts, files, subject, template, batchSize = 100) {
    // const processedEmails = loadProcessedEmails();

    for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);

        for (const contact of batch) {
            // if (processedEmails.has(contact.email)) {
            //     console.log(`Email already sent to ${contact.email}, skipping...`);
            //     continue;
            // }

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: contact.email,
                subject: subject,
                text: template.replace('{{name}}', `${contact.name},`),
                attachments: files,
            };
            console.log(`Email sending to ${contact.email}: Name- ${contact.name} ....`);
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${contact.email}: ${info.response}`);
                // processedEmails.add(contact.email); // Add to log
                // saveProcessedEmails(processedEmails); // Save log
            } catch (error) {
                console.error(`Error sending email to ${contact.email}: ${error}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay between emails
        }

        if (i + batchSize < contacts.length) {
            console.log('Waiting for the next batch...');
            await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000)); // 24 hours delay
        }
    }
}

// Function to initiate the process
async function initiateEmailProcess() {
    const directory = path.resolve(__dirname, 'files');
    const excelFilePath = path.join(directory, 'contacts.xlsx');
    const textFilePath = path.join(directory, 'message.txt');
    const subjectFilePath = path.join(directory, 'subject.txt');

    if (!fs.existsSync(excelFilePath) || !fs.existsSync(textFilePath) || !fs.existsSync(subjectFilePath)) {
        console.error("Excel, Text, or Subject file not found!");
        return;
    }

    const contacts = getContacts(excelFilePath);
    const files = getFiles(directory);
    const messageTemplate = fs.readFileSync(textFilePath, 'utf-8');
    const subject = fs.readFileSync(subjectFilePath, 'utf-8').trim();

    await sendEmailsInBatches(contacts, files, subject, messageTemplate);
}

// Schedule the script to run daily at a specific time (e.g., 10:00 AM)
// cron.schedule('0 10 * * *', () => {
//     console.log('Running email process at 10:00 AM');
//     initiateEmailProcess();
// });

// For immediate testing
initiateEmailProcess();


