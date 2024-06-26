import fastify from "fastify"; //import the entire library
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";

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

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)