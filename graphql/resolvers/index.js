const authResolver = require('./auth')
const eventsResolver = require('./events')
const bookingResolver = require('./booking')
const professionalsResolver = require('./professionals')
const appointmentsResolver = require('./appointments')
const profileResolver = require('./profile')

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver,
    ...professionalsResolver,
    ...appointmentsResolver,
    ...profileResolver
}

module.exports = rootResolver;