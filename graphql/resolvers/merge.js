const Event = require('../../models/event');
const User = require('../../models/user')
const Professional = require('../../models/professional');
const Profile = require('../../models/profile')
const { dateToString, dateToString2 } = require('../../helpers/date')

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

const singleProfessional = async professionalId => {
    try {
        const professional = await Professional.findById(professionalId);
        return transformProfessional(professional);
    } catch (err) {
        throw err;
    }
}

const profile = async profileId => {
    try {
        const profile = await Profile.findById(profileId);
        return transformProfile(profile);
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents),
            profile: profile.bind(this, user._doc.profile)
        }
    } catch (err) {
        throw err;
    }
}

const user2 = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
        }
    } catch (err) {
        throw err;
    }
}

const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        profile: profile.bind(this, user.profile)
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)

    }
}

const transformProfessional = professional => {
    return {
        ...professional._doc,
        _id: professional.id

    }
}

const transformProfile = profile => {
    return {
        ...profile._doc,
        _id: profile.id,
        birthday: dateToString2(profile._doc.birthday),
        user: user.bind(this, profile.user)

    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const transformAppointment = appointment => {
    return {
        ...appointment._doc,
        _id: appointment.id,
        user: user.bind(this, appointment._doc.user),
        professional: singleProfessional.bind(this, appointment._doc.professional),
        startDate: dateToString(appointment._doc.startDate),
        endDate: dateToString(appointment._doc.startDate),
        createdAt: dateToString(appointment._doc.createdAt),
        updatedAt: dateToString(appointment._doc.updatedAt)
    }
}


exports.transformEvent = transformEvent;
exports.transformProfessional = transformProfessional;
exports.transformBooking = transformBooking;
exports.transformAppointment = transformAppointment;
exports.transformProfile = transformProfile;
exports.transformUser = transformUser;