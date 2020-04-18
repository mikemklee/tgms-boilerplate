"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const User_1 = require("./entity/User");
const stripe_1 = require("./stripe");
exports.resolvers = {
    Query: {
        me: (_, __, { req }) => {
            if (!req.session.userId) {
                return null;
            }
            return User_1.User.findOne(req.session.userId);
        },
    },
    Mutation: {
        register: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt.hash(password, 10);
            yield User_1.User.create({
                email,
                password: hashedPassword,
            }).save();
            return true;
        }),
        login: (_, { email, password }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                return null;
            }
            const valid = yield bcrypt.compare(password, user.password);
            if (!valid) {
                return null;
            }
            req.session.userId = user.id;
            return user;
        }),
        createSubscription: (_, { source, ccLast4 }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.session || !req.session.userId) {
                throw new Error('not authenticated');
            }
            const user = yield User_1.User.findOne(req.session.userId);
            if (!user) {
                throw new Error();
            }
            let stripeId = user.stripeId;
            if (!stripeId) {
                const customer = yield stripe_1.stripe.customers.create({
                    email: user.email,
                    source: source,
                });
                stripeId = customer.id;
            }
            else {
                yield stripe_1.stripe.customers.update(stripeId, {
                    source,
                });
            }
            stripe_1.stripe.subscriptions.create({
                customer: stripeId,
                items: [{ plan: process.env.STRIPE_PLAN }],
            });
            user.stripeId = stripeId;
            user.type = 'paid';
            user.ccLast4 = ccLast4;
            yield user.save();
            return user;
        }),
        changeCreditCard: (_, { source, ccLast4 }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.session || !req.session.userId) {
                throw new Error('not authenticated');
            }
            const user = yield User_1.User.findOne(req.session.userId);
            if (!user || !user.stripeId || user.type !== 'paid') {
                throw new Error();
            }
            yield stripe_1.stripe.customers.update(user.stripeId, { source });
            user.ccLast4 = ccLast4;
            yield user.save();
            return user;
        }),
        cancelSubscription: (_, __, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.session || !req.session.userId) {
                throw new Error('not authenticated');
            }
            const user = yield User_1.User.findOne(req.session.userId);
            if (!user || !user.stripeId || user.type !== 'paid') {
                throw new Error();
            }
            const stripeCustomer = (yield stripe_1.stripe.customers.retrieve(user.stripeId));
            if (!stripeCustomer.subscriptions) {
                throw new Error();
            }
            const [subscription] = stripeCustomer.subscriptions.data;
            yield stripe_1.stripe.subscriptions.del(subscription.id);
            yield stripe_1.stripe.customers.deleteSource(user.stripeId, stripeCustomer.default_source);
            user.type = 'trial';
            yield user.save();
            return user;
        }),
    },
};
//# sourceMappingURL=resolvers.js.map