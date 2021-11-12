const Event = require('../../models/event');
const User = require('../../models/user')
const bcrypt = require('bcryptjs')

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event._doc.creator)
            }
        })
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
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    events: async() => {
        //this find method is provided by mongoose. if we execute the method with no filters, it'll retrieve all the Event objects it finds.
        try {
            const events = await Event.find() //.populate('creator')
                //this mapping is done to leave out all the metadata that mongoose generates. this is done using the _doc property (also provided by mongoose)
            return events.map(event => {
                //this _id part is to overwrite the original _id retrieved in _doc, becasue GraphQL doesn't "understand" the special datatype that _id is originally.
                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async(args) => {

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '618ed877b0c964f3eee98dac'
        })
        let createdEvent;

        try {
            //due to the GraphQL configuration, this function/method must return an object
            const result = await event.save()
            createdEvent = {...result._doc, _id: event._doc._id.toString(), creator: user.bind(this, result._doc.creator) }
            const creator = await User.findById('618ed877b0c964f3eee98dac')


            if (!creator) {
                throw new Error('User does not exists.')
            }
            creator.createdEvents.push(event);
            //mongoose handles this event object that I'm passing as an argument.
            await creator.save();


            return createdEvent;
            //_doc is a property provided by mongoose which give all the core properties that make the object and leave out all the metadata
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    createUser: async(args) => {

        try {
            const existingUser = await User.findOne({ email: args.userInput.email })

            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt
                .hash(args.userInput.password, 12)


            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();

            //the part id: result.id is a simplified version of what I did manually, it's also provided by mongoose :) and I'm also overriding the password to null everytime someone wants to retrieve it because even though it's hashed, it's still a security issue.
            return {...result._doc, password: null, id: result.id }

        } catch (err) {
            throw err;
        }

    }
}