const shortid = require("shortid");
const dbFilename = `./data/test-${shortid.generate()}.db`;
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: dbFilename
    },
    useNullAsDefault: true,
    log: {
        warn() { },
        error() { },
        deprecate() { },
        debug() { }
    }
});
const fs = require("fs");
const schema = require("./../data/schema");
const request = require("supertest");
const express = require("express");
const todoService = require("./../services/todos");
const app = express();

beforeAll(() => {
    return schema(knex).then(() => {
        app.use("/", require("./index")(knex));
        app.use(require("./../services/expressErrorHandler"));

        return app;
    });
});

afterAll(() => {
    // Delete the created Test Database
    return new Promise((resolve, reject) => {
        fs.unlink(dbFilename, (error, ok) => {
            if (error) {
                reject(error);
            } else {
                resolve(ok);
            }
        });
    });
});

const expectedStatusCodeTest = (response, statusCode) => {
    expect(response).toHaveProperty("status", statusCode);
}; // close expectedStatusCodeTest
const expectedListHeadersForEndpoint = (response) => {
    return [
        "x-page",
        "x-items-per-page",
        "x-total-items"
    ].forEach(expectedHeader => {
        // Headers return Strings! expect a String Matching a Positive Integer
        expect(response.header).toHaveProperty(expectedHeader, expect.stringMatching(/^[0-9]{1,}$/));
    });
}; // close expectedListHeadersForEndpoint

describe("Index Route", () => {
    describe("on the / endpoint", () => {
        const thisEndpoint = "/";
        let createdId;

        beforeAll(() => {
            return todoService(knex).createItem({
                name: "Get List List"
            }).then(createdObject => {
                createdId = createdObject.id;
            });
        });

        describe("GET requests", () => {
            test("returns a 200 status code", async () => {
                const response = await request(app).get(thisEndpoint);

                expectedStatusCodeTest(response, 200);
            });

            test("returns an Array", async () => {
                const response = await request(app).get(thisEndpoint);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body).toContainEqual(expect.objectContaining({
                    id: createdId
                }));
            });

            test("returns the expected headers", async () => {
                const response = await request(app).get(thisEndpoint);

                expectedListHeadersForEndpoint(response);
            });

        });
        describe("POST requests", () => {
            const insertData = {
                name: "my test list"
            };

            test("returns a 201 status code and returns the creaded object", async () => {
                const response = await request(app).post(thisEndpoint).send(insertData);

                expectedStatusCodeTest(response, 201);
                expect(response).toHaveProperty("body", expect.objectContaining(insertData));
            });

            [
                "id",
                "created",
                "updated",
                "isDeleted"
            ].forEach(key => {
                test(`returns a 417 validation error if ${key} is passed`, async () => {
                    const dataset = {};

                    dataset[key] = "random";

                    const response = await request(app).post(thisEndpoint).send(dataset);

                    expect(response).toHaveProperty("status", 417);
                    expect(response.body).toHaveProperty("message", expect.stringMatching(new RegExp("Validation Error", "i")));
                    expect(response.body).toHaveProperty("details", expect.stringMatching(new RegExp(key, "i")));
                });
            });
        });
        describe("PATCH requests", () => {
            test("returns 405 status code", async() => {
                const response = await request(app).patch(thisEndpoint);

                expectedStatusCodeTest(response, 405);
            });
        });
        describe("PUT requests", () => {
            test("returns 405 status code", async () => {
                const response = await request(app).put(thisEndpoint);

                expectedStatusCodeTest(response, 405);
            });
        });
        describe("DELETE requests", () => {
            test("returns 405 status code", async () => {
                const response = await request(app).delete(thisEndpoint);

                expectedStatusCodeTest(response, 405);
            });
        });
    });

    describe("on the /:listId endpoint", () => {
        let thisEndpoint;
        let createdId;
        const createdLabel = "Created /:listId Test List";

        beforeAll(() => {
            return todoService(knex).createItem({
                name: createdLabel
            }).then(createdObject => {
                createdId = createdObject.id;
                thisEndpoint = `/${createdObject.id}`;
            });
        });

        describe("GET requests", () => {
            test("returns the expected object", async () => {
                const response = await request(app).get(thisEndpoint);

                expect(response).toHaveProperty("status", 200);
            });

            test("returns the expected object", async () => {
                const response = await request(app).get(thisEndpoint);

                expect(Array.isArray(response.body)).toBe(false);
                expect(response.body).toHaveProperty("name", createdLabel);
                expect(response.body).toHaveProperty("id", createdId);
            });

            test("returns 404 for unknown object", async () => {
                const response = await request(app).get(thisEndpoint + "999");

                expect(response).toHaveProperty("status", 404);
            });
        });
        describe("POST requests", () => {
            test("returns 405 status code", async () => {
                const response = await request(app).post(thisEndpoint);

                expectedStatusCodeTest(response, 405);
            });
        });
        describe("PATCH requests", () => {
            test("returns 405 status code", async () => {
                const response = await request(app).patch(thisEndpoint);

                expectedStatusCodeTest(response, 405);
            });
        });
        describe("PUT requests", () => {
            test("returns the edited object", async () => {
                const editedLabel = createdLabel + " - Edited";
                const response = await request(app).put(thisEndpoint).send({
                    name: editedLabel
                });

                expect(response).toHaveProperty("status", 202);
                expect(Array.isArray(response.body)).toBe(false);
                expect(response.body).toHaveProperty("name", editedLabel);
            });

            [
                "id",
                "created",
                "updated",
                "isDeleted"
            ].forEach(key => {
                test(`returns a 417 validation error if ${key} is passed`, async () => {
                    const dataset = {};

                    dataset[key] = shortid.generate();

                    const response = await request(app).put(thisEndpoint).send(dataset);

                    expect(response).toHaveProperty("status", 417);
                    expect(response.body).toHaveProperty("message", expect.stringMatching(new RegExp("Validation Error", "i")));
                    expect(response.body).toHaveProperty("details", expect.stringMatching(new RegExp(key, "i")));
                });
            });
        });
        describe("DELETE requests", () => {
            test("removes the object and can not be selected back out", async () => {
                // Test Deleting
                const response = await request(app).delete(thisEndpoint);

                expect(response).toHaveProperty("status", 204);

                // Test that its no longer in the List View
                const listResponse = await request(app).get("/");

                expect(listResponse).toHaveProperty("status", 200);
                expect(listResponse.body).not.toContainEqual(expect.objectContaining({
                    id: createdId
                }));

                // Test that its no longer selectable
                const itemResponse = await request(app).get(thisEndpoint);

                expect(itemResponse).toHaveProperty("status", 404);
            });
        });
    });
});
