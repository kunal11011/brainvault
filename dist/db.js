"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.MemoryModel = exports.TagModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("./constants");
const CONNECTION_STRING = process.env.MONGOURL;
mongoose_1.default.connect(CONNECTION_STRING);
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true },
    password: { type: String, minLength: 6 },
});
const TagSchema = new mongoose_1.Schema({
    tag: { type: String, unique: true },
});
const MemorySchema = new mongoose_1.Schema({
    type: { type: String, enum: constants_1.MEMORY_TYPE, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tag" }],
    userId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
});
exports.TagModel = (0, mongoose_1.model)("Tag", TagSchema);
exports.MemoryModel = (0, mongoose_1.model)("Memory", MemorySchema);
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
