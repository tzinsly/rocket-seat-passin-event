# Rocket Seta Project: Pass In Event
This is a nodejs project created with RocketSeat classes - the application is called Pass In : an on-site event manager

## Tech Stack

### Fastify
Lightweight web framework for nodejs to mange http requests and routes.

### Prisma
Persistency layear 

## Local Setup
### How to run the application

1. Install dependencies
   $ npm install typescript @types/node -D
   $ npm install fastify
   $ npm install @prisma
   $ npm install fastify-type-provider-zod
   
2. Executing the project 
$ npm run <name-of-script>
*Check scripts configuration inside package.json

## Notes
### npx command
```
    $ npx = npm exec
    $ npx tsc
    $ npx --help
    $ npx tsc --init
```

### Executing javascript
```
    node .\src\server.ts (works if no specific ts code in it)
    node .\src\another-script.js
```

### Executing typescript: 
```
    npx tsx .\src\server.ts  = npm exec tsc .\src\server.ts | node .\src\server.js
```
> it comprises both: the "compilation" or transformation of typescript into a valid javascript and then its execution.


## Features

1. **Event Manager** can crete new Events in the platform
2. **Participant** can subscribe to an event


