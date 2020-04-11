import { IResolvers } from 'apollo-server-express';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/User';

export const resolvers: IResolvers = {
  Query: {
    hello: () => 'hi',
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
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      return user;
    },
  },
};
