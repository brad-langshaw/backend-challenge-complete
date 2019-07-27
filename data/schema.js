module.exports = (knex) => {
    /* istanbul ignore next */
    const tableName = "todoLists";

    return knex.schema.hasTable(tableName).then((exists) => {
        if (!exists) {
            return knex.schema.createTable(tableName, (table) => {
                /*
                    Build The Table To Be Tested
                */
                table.string("id").primary();
                table.string("name").notNull();
                table.dateTime("created").notNull().defaultTo(knex.fn.now());
                table.dateTime("updated").notNull().defaultTo(knex.fn.now());
                table.boolean("isDeleted").notNull().defaultTo(false);
            }); // close createTable / insert data
        } // close if !exists
    });
}; // close export schema
