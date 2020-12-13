const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adopt.us@gmail.com',
    pass: 'pass email'
  }
})

function sendMail (payload) {
  const { recipient, subject, message } = payload
  
  const mailOptions = {
    from: 'adopt.us@gmail.com',
    to: recipient,
    subject: subject,
    html: message
  }
  let response = ''
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      response = 'error'
    } else {
      response = 'success'
    }
  })
  return response
}

module.exports = sendMail