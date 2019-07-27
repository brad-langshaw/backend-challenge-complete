const express = require("express");
const bodyParser = require("body-parser");
const todoService = require("./../services/todos");
const shortid = require("shortid");
const { methodNotAllowed, notFound} = require("./../services/errors");
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
            var query = request.body;
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;

            if(!query.id && !query.created && !query.updated && !query.isDeleted){
                var jsonData = {
                    id: shortid.generate(),
                    name: query.name,
                    created: new Date(),
                    updated: new Date(),
                    isDeleted: 0
                };

                Promise.all([
                    response.statusCode = 201,
                    todoService(knex).createItem(),
                    todoService(knex).getCount()
                ]).then(([
                    count
                ]) => {
                    response.set("x-page", pageNo);
                    response.set("x-items-per-page", itemsPerPage);
                    response.set("x-total-items", count);

                    response.status(201).send(jsonData);
                }).catch(next);
            }else{
                if(query.id){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {


                        response.status(417).send({
                            message: "Validation Error",
                            details: "/id/i"
                        });
                    }).catch(next);
                }else
                if(query.created){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {

                        response.status(417).send({
                            message: "Validation Error",
                            details: "/created/i"
                        });
                    }).catch(next);
                }else
                if(query.updated){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {

                        response.status(417).send({
                            message: "Validation Error",
                            details: "/updated/i"
                        });
                    }).catch(next);
                }else
                if(query.isDeleted){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {


                        response.status(417).send({
                            message: "Validation Error",
                            details: "/isDeleted/i"
                        });
                    }).catch(next);
                }
            }
        })
        .patch((request, response, next) => {
            next(methodNotAllowed());
        })
        .put((request, response, next) => {
            next(methodNotAllowed());
        })
        .delete((request, response, next) => {
            next(methodNotAllowed());
        })
    ; // close router.route("/")

    router.route("/:listId")
        .get((request, response, next) => {
            todoService(knex).getItem(request.params.listId).then((record) => {
                if (record && record.isDeleted != 1) {
                    response.json(record);
                } else {
                    next(notFound());
                }
            }).catch(next);
        })
        .post((request, response, next) => {
            next(methodNotAllowed());
        })
        .patch((request, response, next) => {
            next(methodNotAllowed());
        })
        .put(bodyParser.json(), bodyParser.urlencoded({ extended: false }), (request, response, next) => {
            // EDIT THIS LIST
            var editQuery = request.body;
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;

            if(!editQuery.id && !editQuery.created && !editQuery.updated && !editQuery.isDeleted){
                Promise.all([
                    response.statusCode = 202,
                    todoService(knex).editItem(request.params.listId),
                    todoService(knex).getCount()
                ]).then(() => {
                    response.set("x-page", pageNo);
                    response.set("x-items-per-page", itemsPerPage);
                    response.set("x-total-items", 1);

                    response.status(202).send(request.body);
                }).catch(next);
            }else{
                if(editQuery.id){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {

                        response.status(417).send({
                            message: "Validation Error",
                            details: "/id/i"
                        });
                    }).catch(next);
                }else
                if(editQuery.created){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {
                        response.status(417).send({
                            message: "Validation Error",
                            details: "/created/i"
                        });
                    }).catch(next);
                }else if(editQuery.updated){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {

                        response.status(417).send({
                            message: "Validation Error",
                            details: "/updated/i"
                        });
                    }).catch(next);
                }else if(editQuery.isDeleted){
                    Promise.all([
                        response.statusCode = 417
                    ]).then(() => {


                        response.status(417).send({
                            message: "Validation Error",
                            details: "/isDeleted/i"
                        });
                    }).catch(next);
                }
            }
        })
        .delete((request, response, next) => {
            // DELETE THIS LIST
            const pageNo = request.query.pageNo || 1;
            const itemsPerPage = request.query.itemsPerPage || 10;

            Promise.all([
                response.statusCode = 204,
                todoService(knex).deleteItem(request.params.listId),
                todoService(knex).getCount()
            ]).then(() => {
                response.set("x-page", pageNo);
                response.set("x-items-per-page", itemsPerPage);
                response.set("x-total-items", 1);
                response.status(204).send(request.body);
            }).catch(next);
        })
    ; // close router.route("/:listId")

    return router;
}; // close module.exports
