import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    // service: 'gmail', // or another service like 'outlook', 'yahoo', etc.
    host: "smtp.gmail.com",
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    debug: true
});

transporter.verify(function(error, success) {
    if (error) {
        console.log("Server connection failed:", error);
    } else {
        console.log("Server is ready to send messages");
    }
});

export {transporter}