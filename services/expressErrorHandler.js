module.exports = (error, request, response, next) => {
    /* istanbul ignore if  */ // This should only occure if some uncaught error occures, cant test for that
    if (!error.status) {
        error.status = error.statusCode || 500;
    }
    /* istanbul ignore if  */ // This should only occure if some uncaught error occures, cant test for that
    if (!error.message) {
        error.message = "Something has Gone Horribly Horribly Wrong!";
    }

    const errorResponse = {
        status: error.status,
        message: error.message
    };

    if (error.details) {
        errorResponse.details = error.details;
    }

    const isEmptyObject = (value) => {
        return (
            (value === undefined) ||
            (value === null) ||
            (Object.keys(value).length === 0)
        );
    }; // close isEmptyObject

    if (error.stack && !isEmptyObject(error.stack)) {
        errorResponse.trace = error.stack.split(new RegExp("[\\n\\r]{1,}", "g"));
    }

    if (request.body && !isEmptyObject(request.body)) {
        errorResponse.requestbody = request.body;
    }

    if (request.query && !isEmptyObject(request.query)) {
        errorResponse.querystring = request.query;
    }

    if (error.status > 400) {
        response.status(error.status).json(errorResponse);
    } else {
        next(error);
    }
};
