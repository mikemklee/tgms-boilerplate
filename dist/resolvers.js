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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = __importStar(require("bcryptjs"));
var User_1 = require("./entity/User");
var stripe_1 = require("./stripe");
exports.resolvers = {
    Query: {
        me: function (_, __, _a) {
            var req = _a.req;
            if (!req.session.userId) {
                return null;
            }
            return User_1.User.findOne(req.session.userId);
        },
    },
    Mutation: {
        register: function (_, _a) {
            var email = _a.email, password = _a.password;
            return __awaiter(void 0, void 0, void 0, function () {
                var hashedPassword;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, bcrypt.hash(password, 10)];
                        case 1:
                            hashedPassword = _b.sent();
                            return [4, User_1.User.create({
                                    email: email,
                                    password: hashedPassword,
                                }).save()];
                        case 2:
                            _b.sent();
                            return [2, true];
                    }
                });
            });
        },
        login: function (_, _a, _b) {
            var email = _a.email, password = _a.password;
            var req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, valid;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, User_1.User.findOne({ where: { email: email } })];
                        case 1:
                            user = _c.sent();
                            if (!user) {
                                return [2, null];
                            }
                            return [4, bcrypt.compare(password, user.password)];
                        case 2:
                            valid = _c.sent();
                            if (!valid) {
                                return [2, null];
                            }
                            req.session.userId = user.id;
                            return [2, user];
                    }
                });
            });
        },
        createSubscription: function (_, _a, _b) {
            var source = _a.source, ccLast4 = _a.ccLast4;
            var req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, stripeId, customer;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.session || !req.session.userId) {
                                throw new Error('not authenticated');
                            }
                            return [4, User_1.User.findOne(req.session.userId)];
                        case 1:
                            user = _c.sent();
                            if (!user) {
                                throw new Error();
                            }
                            stripeId = user.stripeId;
                            if (!!stripeId) return [3, 3];
                            return [4, stripe_1.stripe.customers.create({
                                    email: user.email,
                                    source: source,
                                })];
                        case 2:
                            customer = _c.sent();
                            stripeId = customer.id;
                            return [3, 5];
                        case 3: return [4, stripe_1.stripe.customers.update(stripeId, {
                                source: source,
                            })];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            stripe_1.stripe.subscriptions.create({
                                customer: stripeId,
                                items: [{ plan: process.env.STRIPE_PLAN }],
                            });
                            user.stripeId = stripeId;
                            user.type = 'paid';
                            user.ccLast4 = ccLast4;
                            return [4, user.save()];
                        case 6:
                            _c.sent();
                            return [2, user];
                    }
                });
            });
        },
        changeCreditCard: function (_, _a, _b) {
            var source = _a.source, ccLast4 = _a.ccLast4;
            var req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.session || !req.session.userId) {
                                throw new Error('not authenticated');
                            }
                            return [4, User_1.User.findOne(req.session.userId)];
                        case 1:
                            user = _c.sent();
                            if (!user || !user.stripeId || user.type !== 'paid') {
                                throw new Error();
                            }
                            return [4, stripe_1.stripe.customers.update(user.stripeId, { source: source })];
                        case 2:
                            _c.sent();
                            user.ccLast4 = ccLast4;
                            return [4, user.save()];
                        case 3:
                            _c.sent();
                            return [2, user];
                    }
                });
            });
        },
        cancelSubscription: function (_, __, _a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, stripeCustomer, subscription;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!req.session || !req.session.userId) {
                                throw new Error('not authenticated');
                            }
                            return [4, User_1.User.findOne(req.session.userId)];
                        case 1:
                            user = _b.sent();
                            if (!user || !user.stripeId || user.type !== 'paid') {
                                throw new Error();
                            }
                            return [4, stripe_1.stripe.customers.retrieve(user.stripeId)];
                        case 2:
                            stripeCustomer = (_b.sent());
                            if (!stripeCustomer.subscriptions) {
                                throw new Error();
                            }
                            subscription = stripeCustomer.subscriptions.data[0];
                            return [4, stripe_1.stripe.subscriptions.del(subscription.id)];
                        case 3:
                            _b.sent();
                            return [4, stripe_1.stripe.customers.deleteSource(user.stripeId, stripeCustomer.default_source)];
                        case 4:
                            _b.sent();
                            user.type = 'trial';
                            return [4, user.save()];
                        case 5:
                            _b.sent();
                            return [2, user];
                    }
                });
            });
        },
    },
};
//# sourceMappingURL=resolvers.js.map