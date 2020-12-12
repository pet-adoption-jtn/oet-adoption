const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email address',
    pass: 'pass email'
  }
})

function sendMail (payload) {
  const { recipient, subject, message } = payload
  
  const mailOptions = {
    from: 'email address',
    to: recipient,
    subject: subject,
    html: message
  }

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(`email sent ${info.response}`)
    }
  })
}

module.exports = sendMail