const express = require("express");
const app = express();

const { notFound } = require("./services/errors");

module.exports = (knex) => {
    // Populate some Data!
    app.set("json spaces", 4);

    app.use("/", require("./routes/index")(knex));

    app.use("*", (request, response, next) => {
        next(notFound());
    });

    app.use(require("./services/expressErrorHandler"));

    setTimeout(() => {
        app.emit("appStarted");
        app.set("appStarted", true);
    }, 100);

    return app;
};
