"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = void 0;
exports.STATUS_CODES = {
    SUCCESS: {
        code: 200,
        name: "Success",
        message: "The request has succeeded.",
    },
    CREATED: {
        code: 201,
        name: "Created",
        message: "The request has succeeded and a new resource has been created as a result.",
    },
    ACCEPTED: {
        code: 202,
        name: "Accepted",
        message: "The request has been received but not yet completed.",
    },
    NO_CONTENT: {
        code: 204,
        name: "No Content",
        message: "The server successfully processed the request, but there is no content to return.",
    },
    BAD_REQUEST: {
        code: 400,
        name: "Bad Request",
        message: "The request could not be understood by the server due to malformed syntax.",
    },
    UNAUTHORIZED: {
        code: 401,
        name: "Unauthorized",
        message: "Authentication is required and has failed or has not been provided.",
    },
    FORBIDDEN: {
        code: 403,
        name: "Forbidden",
        message: "The server understood the request, but refuses to authorize it.",
    },
    NOT_FOUND: {
        code: 404,
        name: "Not Found",
        message: "The server could not find the requested resource.",
    },
    CONFLICT: {
        code: 409,
        name: "Conflict",
        message: "The request could not be completed due to a conflict with the current state of the resource.",
    },
    TOO_MANY_REQUESTS: {
        code: 429,
        name: "Too Many Requests",
        message: "The user has sent too many requests in a given amount of time (rate limiting).",
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        name: "Internal Server Error",
        message: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    },
    SERVICE_UNAVAILABLE: {
        code: 503,
        name: "Service Unavailable",
        message: "The server is currently unable to handle the request due to temporary overloading or maintenance.",
    },
    GATEWAY_TIMEOUT: {
        code: 504,
        name: "Gateway Timeout",
        message: "The server, while acting as a gateway, did not receive a timely response from an upstream server.",
    },
};
