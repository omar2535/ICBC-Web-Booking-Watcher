const nodemailer = require('nodemailer');
const fs = require('fs');
const yaml = require('js-yaml')


function sendEmailNotification(result) {
    let config = loadGmailConfig();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    var mailOptions = {
        from: config.user,
        to: config.receiver,
        subject: config.subject,
        html: generateEmailBody(result)
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function loadGmailConfig() {
    try {
        let fileContents = fs.readFileSync('./config/email_config.yml', 'utf8');
        let data = yaml.safeLoad(fileContents);
        return data;
    } catch (e) {
        console.log(e);
    }
}

function generateEmailBody(result) {
    let email_body = "";
    email_body += "<h1>ICBC Watcher Notification</h1>"
    for (const date in result) {
        email_body += `<h3>${date}</h3>`
        email_body += `<ul>`
        result[`${date}`].forEach(time => {
            email_body += `<li>${time}</li>`
        })
        email_body += `</ul>`
    }
    return email_body;
}

module.exports = sendEmailNotification;
