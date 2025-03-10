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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middlewares_1 = require("./middlewares");
const validations_1 = require("./validations");
const constants_1 = require("./constants");
// dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const app = (0, express_1.default)();
// app.use(bodyParser.json());
app.use(express_1.default.json());
app.post("/api/v1/signup", (0, middlewares_1.validateData)(validations_1.userSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hashedPass = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        const existingUser = yield db_1.UserModel.findOne({ email: email });
        if (existingUser) {
            throw new Error("User Already Exists.");
        }
        const user = yield db_1.UserModel.create({
            email: req.body.email,
            password: hashedPass,
        });
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        res
            .status(SUCCESS.code)
            .json({ message: SUCCESS.message, name: SUCCESS.name, data: user });
    }
    catch (error) {
        if (error.message == "User Already Exists.") {
            const BAD_REQUEST = constants_1.STATUS_CODES.BAD_REQUEST;
            error.statusCode = BAD_REQUEST.code;
        }
        const INTERNAL_SERVER_ERROR = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
        error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR.code;
        error.message = error.message || INTERNAL_SERVER_ERROR.message;
        next(error);
    }
}));
app.post("/api/v1/signin", (0, middlewares_1.validateData)(validations_1.userSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield db_1.UserModel.findOne({ email });
        if (!existingUser) {
            throw new Error("Invalid Credentials.");
        }
        const comparePass = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!comparePass) {
            throw new Error("Invalid Credentials.");
        }
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
        }, SECRET_KEY);
        res.status(SUCCESS.code).json({
            token,
        });
    }
    catch (error) {
        if (error.message == "Invalid Credentials.") {
            const FORBIDDEN = constants_1.STATUS_CODES.FORBIDDEN;
            error.statusCode = FORBIDDEN.code;
        }
        const INTERNAL_SERVER_ERROR = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
        error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR.code;
        error.message = error.message || INTERNAL_SERVER_ERROR.message;
        next(error);
    }
}));
app.post("/api/v1/content", middlewares_1.userMiddleware, (0, middlewares_1.validateData)(validations_1.memorySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, link, title, tags } = req.body;
        // TODO: check for existing tags and then add tags based on that if not present add new tag into the tag schema.
        const newMemory = yield db_1.MemoryModel.create({
            type,
            link,
            title,
            tags,
            userId: req.userId,
        });
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        res.status(SUCCESS.code).json({
            message: SUCCESS.message,
            name: SUCCESS.name,
            data: newMemory,
        });
    }
    catch (error) {
        const SERVICE_UNAVAILABLE = constants_1.STATUS_CODES.SERVICE_UNAVAILABLE;
        error.statusCode = error.statusCode || SERVICE_UNAVAILABLE.code;
        error.message = error.message || SERVICE_UNAVAILABLE.message;
        next(error);
    }
}));
app.get("/api/v1/content", middlewares_1.userMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMemories = yield db_1.MemoryModel.find({
            userId: req.userId,
        }).populate("userId", "email");
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        res.status(SUCCESS.code).json({
            message: SUCCESS.message,
            name: SUCCESS.name,
            data: allMemories,
        });
    }
    catch (error) {
        next(error);
    }
}));
app.post("/api/v1/tag", (0, middlewares_1.validateData)(validations_1.tagSchema), middlewares_1.userMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingTag = yield db_1.TagModel.findOne({ tagName: req.body.tagName });
        if (existingTag) {
            throw new Error("Tag Already Exists.");
        }
        const newTag = yield db_1.TagModel.create({
            tagName: req.body.tagName,
            userId: req.userId,
        });
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        res
            .status(SUCCESS.code)
            .json({ message: SUCCESS.message, name: SUCCESS.name, data: newTag });
    }
    catch (error) {
        if (error.message == "Tag Already Exists.") {
            const BAD_REQUEST = constants_1.STATUS_CODES.BAD_REQUEST;
            error.statusCode = BAD_REQUEST.code;
        }
        const INTERNAL_SERVER_ERROR = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
        error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR.code;
        error.message = error.message || INTERNAL_SERVER_ERROR.message;
        next(error);
    }
}));
app.get("/api/v1/tag", middlewares_1.userMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTags = yield db_1.TagModel.find({
            userId: req.userId,
        }).populate("userId", "email");
        const SUCCESS = constants_1.STATUS_CODES.SUCCESS;
        res.status(SUCCESS.code).json({
            message: SUCCESS.message,
            name: SUCCESS.name,
            data: allTags,
        });
    }
    catch (error) {
        next(error);
    }
}));
app.post("/api/v1/brain/share", (req, res, next) => { });
app.get("/api/v1/brain/:shareLink", (req, res, next) => { });
app.use((err, req, res, next) => {
    // console.trace(err);
    const SERVICE_UNAVAILABLE = constants_1.STATUS_CODES.SERVICE_UNAVAILABLE;
    const errStatusCode = err.statusCode || SERVICE_UNAVAILABLE.code;
    const errMsg = err.message || SERVICE_UNAVAILABLE.message;
    res.status(errStatusCode).json({
        success: false,
        status: errStatusCode,
        message: errMsg,
    });
});
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
