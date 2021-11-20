const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {

    createUser: async(args) => {

        try {
            const existingUser = await User.findOne({ email: args.userInput.email })

            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

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

    },

    login: async({ email, password }) => {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("User does not exists!");
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            throw new Error("Password is incorrect");
        }

        const token = await jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });

        return { userId: user.id, token: token, tokenExpiration: 1 }

    }
};