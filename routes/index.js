const express = require("express");
const bodyParser = require("body-parser");
const todoService = require("./../services/todos");
const { methodNotAllowed, notFound, notAcceptable } = require("./../services/errors");
const router = express.Router({
    caseSensitive: true
});

module.exports = (knex) => {
    router.route("/")
        .get((request, response, next) => {
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;
          
            Promise.all([
                todoService(knex).getList({
                    pageNo: pageNo,
                    itemsPerPage: itemsPerPage
                }),
                todoService(knex).getCount()
            ]).then(([
                recordSet,
                count
            ]) => {
                response.set("x-page", pageNo);
                response.set("x-items-per-page", itemsPerPage);
                response.set("x-total-items", count);

                response.json(recordSet);
            }).catch(next);
        })
        .post(bodyParser.json(), bodyParser.urlencoded({ extended: false }), (request, response, next) => {
            // Adds a new entry then gets the lists of all entries
            todoService(knex).createItem()
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;
          
            Promise.all([
                todoService(knex).getList({
                    pageNo: pageNo,
                    itemsPerPage: itemsPerPage
                }),
                todoService(knex).getCount()
            ]).then(([
                recordSet,
                count
            ]) => {
                response.set("x-page", pageNo);
                response.set("x-items-per-page", itemsPerPage);
                response.set("x-total-items", count);

                response.json(recordSet);
            }).catch(next);
        })
        .patch((request, response, next) => {
            // Applies patch to all names, changes updated date
            
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;
            todoService(knex).patchList(),
            Promise.all([
                todoService(knex).getList({
                    pageNo: pageNo,
                    itemsPerPage: itemsPerPage
                }),
                todoService(knex).getCount()
            ]).then(([
                recordSet,
                count
            ]) => {
                response.set("x-page", pageNo);
                response.set("x-items-per-page", itemsPerPage);
                response.set("x-total-items", count);

                response.json(recordSet);
            }).catch(next);
        })
        .put((request, response, next) => {
            next(todoService(knex).putList());
        })
        .delete((request, response, next) => {
           //Sets all items to deleted.
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;
            todoService(knex).deleteAll()
            Promise.all([
               // Displays Deleted Itmes
                todoService(knex).getDeleted({
                    pageNo: pageNo,
                    itemsPerPage: itemsPerPage
                }),
                todoService(knex).getCount()
            ]).then(([
                recordSet,
                count
            ]) => {
                response.set("x-page", pageNo);
                response.set("x-items-per-page", itemsPerPage);
                response.set("x-total-items", count);

                response.json(recordSet);
            }).catch(next);
        })
    ; // close router.route("/")

    router.route("/:listId")
        .get((request, response, next) => {
            // displays an item matching the given ID
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
        })
        .post((request, response, next) => {
            // Creates a new item on post when an unknown ID is given
            todoService(knex).createCustomItem(request.params.listId),
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
        })
        .patch((request, response, next) => {
            todoService(knex).patchItem(request.params.listId),
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
        })
        .put(bodyParser.json(), bodyParser.urlencoded({ extended: false }), (request, response, next) => {
            // EDIT THIS LIST
            todoService(knex).editItem(request.params.listId),
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
        })
        .delete((request, response, next) => {
            // DELETE THIS LIST
            todoService(knex).deleteItem(request.params.listId),
            // THEN DISPLAY DELETED ITEM
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
                 })
    ; // close router.route("/:listId")
    
    return router;
}; // close module.exports
