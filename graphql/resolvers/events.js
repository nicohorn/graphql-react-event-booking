const Event = require('../../models/event');
const User = require('../../models/user')

const { transformEvent } = require('./merge')


module.exports = {
    events: async() => {
        //this find method is provided by mongoose. if we execute the method with no filters, it'll retrieve all the Event objects it finds.
        try {
            const events = await Event.find() //.populate('creator')
                //this mapping is done to leave out all the metadata that mongoose generates. this is done using the _doc property (also provided by mongoose)
            return events.map(event => {
                //this _id part is to overwrite the original _id retrieved in _doc, becasue GraphQL doesn't "understand" the special datatype that _id is originally.
                return transformEvent(event);
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
            createdEvent = transformEvent(result);
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
    }

}