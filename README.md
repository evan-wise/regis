# Regis

Trivia chatbot with a heart of gold.

## Prerequisites

Node >= v14.2.0 (using something like [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is a good way to manage node versions on your system)

## Setup

Copy auth.json.example and name it `auth.json` on root with the discord bot token value and [db connection string value](#local-db-setup)

NOTE: DON'T CHECK IT IN!

Seriously, it's a massive security hole!

## Local DB setup

* [Install postgres](https://www.postgresql.org/download/) on your machine.
* Use [pgadmin](https://www.pgadmin.org/download/) or command line to create a db and make note of what you named it.
* Make a super user with all the privileges and give it a password.
* Change the connection string in your local copy of `auth.json` to `postgres://{your user name}:{your password for that user}@localhost:5432/{your new db name}`

## Troubleshooting

* If the terminal/console is blowing up you may need to run `npm run clean:install` which will delete dist and node_modules, run npm i, and then build the project.
* Make sure your dev postgres db is running on your machine when you try and run locally.

## TODOs

* get some persistence up in here
  * migration scripts
* host sheduler
  * make the schedule stuff interactive via discord
* trivia topic goodness
* scorekeeper
  * handle random bonus points
* flush out some actual trivia game mechanisms
  * text based
  * images
  * question/answer timer (don't accept answers after a certain amount of time)
* CI/CD github -> discord integrations or something
* have fun!
* ~~add typescript~~
