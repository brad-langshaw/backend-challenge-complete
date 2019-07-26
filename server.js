const PORT = process.env.PORT || 4040;
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./data/prod.db"
    },
    useNullAsDefault: true,
    log: {
        warn() { },
        error() { },
        deprecate() { },
        debug() { }
    }
});
const schema = require("./data/schema");

schema(knex).then(() => {
    const app = require("./app")(knex);

    app.on("appStarted", () => {
        app.listen(PORT, () => {
            console.info(`Ready at: http://localhost:${PORT}`);
        });
    });
}).catch(error => {
    console.error(error);
    process.exit(1);
});
