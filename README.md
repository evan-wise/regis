# Regis

Trivia chatbot with a heart of gold.

## Setup

Copy auth.json.example and name it `auth.json` on root with the actual token value.

NOTE: DON'T CHECK IT IN!

Seriously, it's a massive security hole!

## TODOs

* get some persistence up in here
  * add some knex migration up and down scripts for initial db schema
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
