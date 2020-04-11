import { IResolvers } from 'apollo-server-express';
import * as bcrypt from 'bcryptjs';

import { User } from './entity/User';
import { stripe } from './stripe';

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      return User.findOne(req.session.userId);
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
      }).save();

      return true;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
    createSubscription: async (_, { source }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('not authenticated');
      }

      const user = await User.findOne(req.session.userId);

      if (!user) {
        throw new Error();
      }

      // create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        source: source,
      });

      // subscribe customer to plan
      stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: process.env.STRIPE_PLAN }],
      });

      user.stripeId = customer.id;
      user.type = 'paid';
      await user.save();

      return user;
    },
  },
};
