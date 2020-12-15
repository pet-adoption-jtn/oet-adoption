const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adopt.us.h8@gmail.com',
    pass: process.env.GMAIL_PASS
  }
})

function sendMail (payload) {
  const { recipient, subject, message } = payload
  
  const mailOptions = {
    from: 'adopt.us.h8@gmail.com',
    to: recipient,
    subject: subject,
    html: message
  }
  
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  })
}

function generateMessage (form_data) {
  return `
  ${form_data}
  `
}

module.exports = {
  sendMail,
  generateMessage
}