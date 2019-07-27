Backend Challenge
=================

A challenge for testing backend development skills.

## Background
This application represents a rudimentary database and Restful API with the purpose of being the start of a To-Do list single-page app. Selecting Items works correctly, however, the creation and removal methods are not as seen by the testing.

Your task, should you choose to accept it, is to complete the project to the best of your abilities and resolve all testing errors.

## Setup
1. Download this Project
2. Install Node Dependancies
3. Run Jest Testing
    - Jest - Single Run Mode (`npm run test`) (includes eslint)
    - Jest - Watch Mode (`npm run watch`)

## Rules
1. You are not allowed to Edit the Tests File(s)
2. You are not allowed to Edit the eslint, package, or gitignore files (we dont want databases or logs being submitted)

## Judgement Criteria
1. Adherence to the rules
2. Adherence to code style
3. Methods used for validation
4. The number of issues successfully identified
5. The overall solution to the problems

## Project Overview
This project is a basic Restful API application connect to an SQLite3 database. Queries are managed by the services which are using [knex](https://knexjs.org/) as an interface.
You can run the server locally with `nodemon` or with `npm run dev`. This will create and/or use a database called prod located in the data directory of the project.

> *Note*: Testing does not use this database

You can use [`cURL`](https://curl.haxx.se/) and/or [`Postman`](https://www.getpostman.com/) to test using the Restful API once it is running.

Running the testing will create, use, and delete, a unique database for each run of the test suite. This ensures that previous run can not corrupt future runs fo the test.
