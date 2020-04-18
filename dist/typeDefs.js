"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type User {\n    id: ID!\n    email: String!\n    type: String!\n    ccLast4: String\n  }\n\n  type Query {\n    me: User\n  }\n\n  type Mutation {\n    register(email: String!, password: String!): Boolean!\n    login(email: String!, password: String!): User\n    createSubscription(source: String!, ccLast4: String!): User\n    changeCreditCard(source: String!, ccLast4: String!): User\n    cancelSubscription: User\n  }\n"], ["\n  type User {\n    id: ID!\n    email: String!\n    type: String!\n    ccLast4: String\n  }\n\n  type Query {\n    me: User\n  }\n\n  type Mutation {\n    register(email: String!, password: String!): Boolean!\n    login(email: String!, password: String!): User\n    createSubscription(source: String!, ccLast4: String!): User\n    changeCreditCard(source: String!, ccLast4: String!): User\n    cancelSubscription: User\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=typeDefs.js.map