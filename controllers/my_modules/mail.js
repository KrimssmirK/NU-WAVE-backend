const nodemailer = require('nodemailer')
const converter = require('./test_date')
const config = require('./config')

const account = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.centie_gmail_info.user,
    pass: config.centie_gmail_info.password,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  }
}




function mailer(form_that_entered){
  const transporter = nodemailer.createTransport(account)
  const ph = converter.convertGMTtoPhTime(form_that_entered.date_added)

  const mail_content_of_buyer = {
    from: account.auth.user,
    to: form_that_entered.email_address,
    subject: 'NU WAVE [TRANSACTION]',
    html: `
    <div class="container">
    <h6 style="font-size: large;">Hi ${form_that_entered.first_name + ' ' + form_that_entered.last_name},</h6>
    <p>Thank you for placing an order on NU Centie Hub.</br>
      We are glad to inform you that we have received your order and we will have it process very soon.</br>
    </br>
      Thank you again for choosing NU Centie Hub for your purchase.
      </p>
      <h6 style="font-size: medium;">Summary:</h6>
  <table class="mb-3">
    <tbody>
      <tr>
        <td>Name:</td>
        <td>${form_that_entered.first_name + ' ' + form_that_entered.last_name}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>${form_that_entered.email_address}</td>
      </tr>
      <tr>
        <td>Product_name:</td>
        <td>${form_that_entered.product_name}</td>
      </tr>
      <tr>
        <td>Quantity:</td>
        <td>${form_that_entered.quantity}</td>
      </tr>
      <tr>
        <td>Order Date:</td>
        <td>${ph.date}</td>
      </tr>
      <tr>
        <td>Order Time:</td>
        <td>${ph.time}</td>
      </tr>
      <tr>
        <td>Mobile Number:</td>
        <td>${form_that_entered.mobile_number}</td>
      </tr>
      <tr>
        <td>Message:</td>
        <td>${form_that_entered.message}</td>
      </tr>
    </tbody>
  </table>
  <p>Please wait for the owner's response for your purchase.</br>We appreciate for your wait.</br></p>
  <h6 style="font-size: large;">Best regards,</br>Team NU Centie</h6>
</div>
    `,
  }

  const mail_content_of_seller = {
    from: account.auth.user,
    to: form_that_entered.mentors_email_address,
    subject: 'NU WAVE [TRANSACTION]',
    html: `
    <div class="container">
    <h6 style="font-size: large;">Hi ${form_that_entered.mentors_name_who_received_the_email},</h6>
    <p>We would like to inform you that your product has been currently requested.</br>
      The customer would like you to confirm his/her purchase by emailing  <a href="mailto:#">${form_that_entered.email_address}</a></br>
      <h5 style="font-size: medium;">Details:</h5>
  <table>
    <tbody>
      <tr>
        <td>Name:</td>
        <td>${form_that_entered.first_name + ' ' + form_that_entered.last_name}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>${form_that_entered.email_address}</td>
      </tr>
      <tr>
        <td>Product Name:</td>
        <td>${form_that_entered.product_name}</td>
      </tr>
      <tr>
        <td>Quantity:</td>
        <td>${form_that_entered.quantity}</td>
      </tr>
      <tr>
        <td>Order Date:</td>
        <td>${ph.date}</td>
      </tr>
      <tr>
        <td>Order Time:</td>
        <td>${ph.time}</td>
      </tr>
      <tr>
        <td>Mobile Number:</td>
        <td>${form_that_entered.mobile_number}</td>
      </tr>
      <tr>
        <td>Message:</td>
        <td>${form_that_entered.message}</td>
      </tr>
    </tbody>
  </table>
  <p>Do not forget to email us back for the receipt at <a href="mailto:#">centIEdeveloper@gmail.com</a></p>
  <h6 style="font-size: large;">Best regards,</br>Team NU Centie</h6>
</div>
    `,
  }

  function send_email_to_buyer() {
    transporter.sendMail(mail_content_of_buyer, (error, info) => {
      if (error) console.log(error.message)
      console.log('Email sent:', info); 
    })
  }

  function send_email_to_seller() {
    transporter.sendMail(mail_content_of_seller, (error, info) => {
      if (error) console.log(error.message)
      console.log('Email sent:', info)
    })
  }

  return { 
    send_email_to_buyer: send_email_to_buyer,
    send_email_to_seller: send_email_to_seller
  }
}

module.exports.mailer = mailer;