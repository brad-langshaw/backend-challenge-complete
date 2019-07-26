const createError = function createError(message, statusCode, details) {
    const thisError = new Error(message);

    if (statusCode) {
        thisError.status = statusCode;
        thisError.statusCode = statusCode;
    }

    if (details) {
        thisError.details = details;
    }

    return thisError;
}; // close createError

/**
 * @description creates an Error Object with a Message to be Used with Express
 * @param {string} message the primary message for the Error.
 * @param {number} statusCode the StatusCode for the Added to the Error.
 * @param {any} details Additional Details to be added to the Error
 * @returns {Error}
 */
const errorMessage = (message, statusCode, details) => createError(message, statusCode, details);

/**
 * @description creates a "Bad Request" Error Object with a StatusCode of 400
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.badRequest = (details) => createError("Bad Request", 400, details);

/**
 * @description creates a "Unauthorized" Error Object with a StatusCode of 401
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.unauthorized = (details) => createError("Unauthorized", 401, details);

/**
 * @description creates a "Forbidden" Error Object with a StatusCode of 403
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.forbidden = (details) => createError("Forbidden", 403, details);

/**
 * @description creates a "Not Found" Error Object with a StatusCode of 404
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.notFound = (details) => createError("Not Found", 404, details);

/**
 * @description creates a "Method Not Allowed" Error Object with a StatusCode of 405
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.methodNotAllowed = (details) => createError("Method Not Allowed", 405, details);

/**
 * @description creates a "Not Acceptable" Error Object with a StatusCode of 406
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.notAcceptable = (details) => createError("Not Acceptable", 406, details);

/**
 * @description creates a "Precondition Failed" Error Object with a StatusCode of 412
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.preconditionFailed = (details) => createError("Precondition Failed", 412, details);

/**
 * @description creates a "Expectation Failed" Error Object with a StatusCode of 417
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.expectationFailed = (details) => createError("Expectation Failed", 417, details);

/**
 * @description creates a "Validation Error" Error Object with a StatusCode of 417
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.validationError = (details) => createError("Validation Error", 417, details);


/**
 * @description creates a "I'm a teapot (RFC 2324)" Error Object with a StatusCode of 418
 * @param {string} details Additional Details to be added to the Error
 * @returns {Error}
 */
errorMessage.imATeapot = (details) => createError("I'm a teapot (RFC 2324)", 418, details);

module.exports = errorMessage;
