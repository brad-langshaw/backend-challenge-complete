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
        getDeleted: (options) => {
            // Display Deleted items
            const settings = extend(true, {
                pageNo: 1,
                itemsPerPage: 10
            }, options);

            return knex(tableName)
                .select("id").where({
                    isDeleted: true
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
                todoTask: "Get your car washed later",
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
        createCustomItem: (pk, data) => {
            const record = extend(false, {
                id: pk,
                name: "Custom Item",
                todoTask: "Go grocery shopping " + pk,
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
            record.isDeleted = false;

            return knex(tableName).update(record).where({
                id: pk
            }).then(() => {
                return listService.getItem(pk);
            });
        },
        patchList: (data) => {
            const record = extend(false, {}, data);

            record.updated = new Date();
            record.name = "Patched in full list patch, all items are no longer deleted";
            record.isDeleted = false;
            
            return knex(tableName).update(record).then(() => {
                return listService.getList(data);
            });
        },
        patchItem: (pk, data) => {
            const record = extend(false, {}, data);

            record.updated = new Date();
            record.name = "Patched in single item patch, this item is no longer deleted";
            record.isDeleted = false;
            
            return knex(tableName).update(record).where({
                id: pk
            }).then(() => {
                return listService.getItem(pk);
            });
        },
        putList: (data) => {
            const record = extend(false, {}, data);

            record.updated = new Date();
            record.name = "Put was called on all items";
            
            
            return knex(tableName).update(record).then(() => {
                return listService.getList(data);
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
        },
        deleteAll: (data) => {
            const record = extend(false, {}, data);
            record.isDeleted = true
            record.updated = new Date();

            return knex(tableName).update(record).where({
                isDeleted: false
            }).then(() => {
                return listService.getDeleted(data);
            });
        }
    }; // close listService

    return listService;
};
