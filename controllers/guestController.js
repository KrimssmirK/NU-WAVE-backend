const Guest = require('../models/Guest')

async function save_guest(guest_ip, guest_user_agent) {
  const new_guest = new Guest({ ip: guest_ip, gadget: guest_user_agent })
  await new_guest
  .save()
  .then(guest_that_saved => console.log(guest_that_saved + '\nnew guest has been recorded'))
  .catch(error => console.log(error.message))
}

async function check_if_the_guest_already_in(guest_ip, callback) {
  await Guest
  .findOne({ ip: guest_ip })
  .then(guest_that_queried => callback(null, guest_that_queried))
  .catch(error => callback(error, null))
}

module.exports.guest_visit_the_website = (req, res, next) => {
  const guest_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const guest_user_agent = req.headers['user-agent']
  check_if_the_guest_already_in(guest_ip, (error, result) => {
    if (error) console.log(error.message)
    const hasGuest = result
    if (!hasGuest) {
      save_guest(guest_ip, guest_user_agent)
    } else {
      console.log('this guest has already entered the website')
    }
  })
  next()
}