//This is where I setup my node.js express server :)

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();
const Event = require('./models/event')

app.use(bodyParser.json());
app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event{
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }
            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }
            type RootQuery{
                events: [Event!]!
            }
            type RootMutation{
                createEvent(eventInput: EventInput): Event
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return;
            },
            createEvent: (args) => {
                // const event = {
                //     _id: Math.random().toString(),
                //     title: args.eventInput.title,
                //     description: args.eventInput.description,
                //     price: args.eventInput.price,
                //     date: args.eventInput.date
                // }

                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    date: new Date(args.eventInput.date)
                })

                event.save().then(result => {
                    console.log(result)
                    return {...result._doc }
                    //_doc is a property provided by mongoose which give all the core properties that make the object and leave out all the metadata
                }).catch(err => {
                    console.log(err)
                    throw err;
                });

                //due to the GraphQL configuration, this function/method must return an object
                return event;
            }
        },
        graphiql: true
    }))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bdyfh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})