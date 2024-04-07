import fastify from "fastify"; //import the entire library
import { serializerCompiler, validatorCompiler, jsonSchemaTransform} from 'fastify-type-provider-zod';
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const app = fastify();
const port = 3001;

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.listen({ port }).then(() => {
    console.log("Fastify server running at localhost: " + port);
})

app.get('/', (req: any, res: any) => {
    console.log("hoome endpoint invoked");
    res.send("Hello from Fastify Server");
})

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'Pass In - Event Management',
            description: 'On Site Event Management API - Pass In',
            version: '0.1.0'
        },
        host: 'localhost:3001',
        schemes: ['http'],
        tags: [
            { name: 'events', description: 'Event related end-points' },
            { name: 'attendees', description: 'Attendee related end-points' }
        ]
    },
    transform: jsonSchemaTransform  
})

app.register(fastifySwaggerUi, {
   routePrefix: '/docs',
})

//coors can be added to allow access from other domains - this is to allow UI to access the API
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
//app.register(checkIn) - TODO not working - fix later
app.register(getEventAttendees)