const { buildSchema } = require('graphql')

module.exports = buildSchema(`

type Booking{
    _id: ID!
    user: User!
    event: Event!
    createdAt: String!
    updatedAt: String!
}

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type Professional{
    _id: ID!
    name: String!
    lastname: String!
    price: Float!
    image: String!
    startTimeMorning: String!
    endTimeMorning: String!
    startTimeAfternoon: String!
    endTimeAfternoon: String!

}

type Appointment{
    _id: ID!
    professional: Professional!
    user: User!
    startDate: String!
    endDate: String!
}

type User {
    _id: ID!
    email: String!
    password: String
    isAdmin: Boolean!
    createdEvents: [Event!]
    profile: Profile
}

type Profile {
    _id: ID!
    name: String!
    lastname: String!
    dni: Int!
    birthday: String!
    user: User
    image: String
}
type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
    isAdmin: Boolean!
    profile: Profile
}
input UserInput {
    email: String!
    password: String!
    isAdmin: Boolean!
}
input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input ProfessionalInput{
    name: String!
    lastname: String!
    price: Float!
    image: String!
    startTimeMorning: String!
    endTimeMorning: String!
    startTimeAfternoon: String!
    endTimeAfternoon: String!
}

input BookAppointmentInput{
    professionalId: ID!
    startDate: String!
}

input ProfileInput{
    name: String!
    lastname: String!
    dni: Int!
    birthday: String!
    userId: ID
    image: String
}

type RootQuery{
    profiles: [Profile!]!
    professionals: [Professional!]!
    appointments: [Appointment!]!
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation{
    createProfessional(professionalInput: ProfessionalInput): Professional
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    createProfile(profileInput: ProfileInput): Profile
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    bookAppointment(bookAppointmentInput: BookAppointmentInput): Appointment!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)