import { IResolvers } from 'apollo-server-express';
import Stripe from 'stripe';
import * as bcrypt from 'bcryptjs';
import fetch from 'node-fetch';

import { User } from './entity/User';
import { stripe } from './stripe';

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      const user = await User.findOne(req.session.userId);

      if (!user) {
        return null;
      }

      return user;
    },
    dog: async () => {
      const imgUrl =
        ((await fetch('https://dog.ceo/api/breeds/image/random')
          .then((res) => res.json())
          .then((json) => json.message)) as String) || '';
      return { imgUrl };
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
        type: 'trial',
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
    createSubscription: async (_, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('not authenticated');
      }

      const user = await User.findOne(req.session.userId);

      if (!user) {
        throw new Error();
      }

      let stripeId = user.stripeId;

      if (!stripeId) {
        // create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          source: source,
        });

        stripeId = customer.id;
      } else {
        // update existing customer
        await stripe.customers.update(stripeId, {
          source,
        });
      }

      // subscribe customer to plan
      stripe.subscriptions.create({
        customer: stripeId,
        items: [{ plan: process.env.STRIPE_PLAN }],
      });

      user.stripeId = stripeId;
      user.type = 'paid';
      user.ccLast4 = ccLast4;
      await user.save();

      return user;
    },
    changeCreditCard: async (_, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('not authenticated');
      }

      const user = await User.findOne(req.session.userId);

      if (!user || !user.stripeId || user.type !== 'paid') {
        throw new Error();
      }

      await stripe.customers.update(user.stripeId, { source });

      user.ccLast4 = ccLast4;
      await user.save();

      return user;
    },
    cancelSubscription: async (_, __, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error('not authenticated');
      }

      const user = await User.findOne(req.session.userId);

      if (!user || !user.stripeId || user.type !== 'paid') {
        throw new Error();
      }

      const stripeCustomer = (await stripe.customers.retrieve(
        user.stripeId
      )) as Stripe.Customer;

      if (!stripeCustomer.subscriptions) {
        throw new Error();
      }

      const [subscription] = stripeCustomer.subscriptions.data;

      // delete user's subscription
      await stripe.subscriptions.del(subscription.id);

      // delete user's card info
      await stripe.customers.deleteSource(
        user.stripeId,
        stripeCustomer.default_source as string
      );

      user.type = 'trial';
      await user.save();

      return user;
    },
  },
};
