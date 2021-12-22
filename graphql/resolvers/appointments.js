const Appointment = require('../../models/appointment');
const { transformBooking, transformEvent, transformAppointment } = require('./merge')


module.exports = {
    appointments: async(args, req) => {
        // if (!req.isAuth) {
        //     throw new Error("Unauthenticated!")
        // }
        // if (req.isAdmin) {
        //     try {
        //         const appointments = await Appointment.find()
        //         return appointments.map(appointment => {
        //             return transformAppointment(appointment);
        //         })
        //     } catch (err) {
        //         throw err;
        //     }
        // } else {
        try {
            const appointments = await Appointment.find({ user: req.userId })
            return appointments.map(appointment => {
                return transformAppointment(appointment)
            })
        } catch (err) {
            throw err;
        }
        // }

    },

    bookAppointment: async(args, req) => {
        //this is working, we only need to retrieve the data from user and professional in a dinamic way.
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        const appointment = new Appointment({
            professional: args.bookAppointmentInput.professionalId,
            user: req.userId,
            startDate: new Date(args.bookAppointmentInput.startDate),
            endDate: new Date(args.bookAppointmentInput.startDate).setHours(new Date(args.bookAppointmentInput.startDate).getHours() + 1)
        })
        const result = await appointment.save()
        return transformAppointment(result);
    }
}