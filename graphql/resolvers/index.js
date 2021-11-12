const Event = require('../../models/event');
const User = require('../../models/user')
const bcrypt = require('bcryptjs')

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event._doc.creator)
                }
            })
        })
        .catch(err => {
            throw err;
        })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err;
        })
}

module.exports = {
    events: () => {
        //this find method is provided by mongoose. if we execute the method with no filters, it'll retrieve all the Event objects it finds.
        return Event.find() //.populate('creator')
            .then(events => {
                //this mapping is done to leave out all the metadata that mongoose generates. this is done using the _doc property (also provided by mongoose)
                return events.map(event => {
                    //this _id part is to overwrite the original _id retrieved in _doc, becasue GraphQL doesn't "understand" the special datatype that _id is originally.
                    return {
                        ...event._doc,
                        _id: event._doc._id.toString(),
                        creator: user.bind(this, event._doc.creator)
                    };
                });
            }).catch(err => {
                console.log(err);
                throw err;
            })
    },
    createEvent: (args) => {

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '6170674dcf8e191cd64a4c67'
        })
        let createdEvent;
        //due to the GraphQL configuration, this function/method must return an object
        return event.save().then(result => {
                createdEvent = {...result._doc, _id: event._doc._id.toString(), creator: user.bind(this, result._doc.creator) }
                return User.findById('6170674dcf8e191cd64a4c67')
            })
            .then(user => {
                if (!user) {
                    throw new Error('User does not exists.')
                }
                user.createdEvents.push(event);
                //mongoose handles this event object that I'm passing as an argument.
                return user.save();
            })
            .then(result => {
                return createdEvent;
                //_doc is a property provided by mongoose which give all the core properties that make the object and leave out all the metadata
            })
            .catch(err => {
                console.log(err)
                throw err;
            });
    },

    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already.')
                }
                return bcrypt
                    .hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save();
            })
            .then(result => {
                //the part id: result.id is a simplified version of what I did manually, it's also provided by mongoose :) and I'm also overriding the password to null everytime someone wants to retrieve it because even though it's hashed, it's still a security issue.
                return {...result._doc, password: null, id: result.id }
            })
            .catch(err => {
                throw err;
            })

    }
}