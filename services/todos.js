const shortid = require("shortid");
const extend = require("extend");
const moment = require("moment");

module.exports = (knex) => {
    const tableName = "todoLists";

    const listService = {
        getList: (options) => {
            const settings = extend(true, {
                pageNo: 1,
                itemsPerPage: 10
            }, options);

            return knex(tableName)
                .select("id").where({
                    isDeleted: false
                }).limit(settings.itemsPerPage)
                .offset((settings.pageNo - 1) * settings.itemsPerPage)
                .orderBy("created", "desc")
                .then(recordSet => Promise.all(recordSet.map(record => listService.getItem(record.id))))
            ;
        },
        getCount: () => {
            return knex(tableName).count("id as count").where({
                isDeleted: false
            }).then(recordSet => recordSet[0].count);
        },
        getItem: (pk) => {
            return knex(tableName).select("*").where({
                id: pk
            }).then((recordSet) => recordSet[0]).then((record) => {
                if (record) {
                    record.created = moment.unix(record.created);
                    record.updated = moment.unix(record.updated);
                }

                return record;
            });
        },
        createItem: (data) => {
            const record = extend(false, {
                id: shortid.generate(),
                name: "",
                created: new Date(),
                updated: new Date(),
                isDeleted: 0
            }, data);

            return knex(tableName)
                .insert(record)
                .then(() => {
                    return listService.getItem(record.id);
                })
            ;
        },
        editItem: (pk, data) => {
            const record = extend(false, {}, data);

            record.updated = new Date();

            return knex(tableName).update(record).where({
                id: pk
            }).then(() => {
                return listService.getItem(pk);
            });
        },
        deleteItem: (pk) => {
            return knex(tableName).update({
                isDeleted: true,
                updated: new Date()
            }).where({
                id: pk
            }).then(() => {
                return listService.getItem(pk);
            });
        }
    }; // close listService

    return listService;
};
