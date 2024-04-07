import fastify from "fastify"; //import the entire library
import z from "zod";
import {PrismaClient} from '@prisma/client' //Importing one of the classes

const app = fastify();
const port = 3001;

const prisma = new PrismaClient({
    log: ['query']
})

app.listen({port}).then( () => {
    console.log("Fastify server running at localhost: " + port);
})

app.get('/', (req: any, res: any) => {
    console.log("hoome endpoint invoked");
    res.send("Hello from Fastify Server");
})

app.post('/events', async (req, res) => { //async is needed here as we are using 'await' for prisma record create

    console.log(`Create event endpoint invoked with following body: ${JSON.stringify(req.body)}`)
    console.log("Creating event...")

    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })

    const data = createEventSchema.parse(req.body);

    //Creating data inside prisma itself - should we move to a different file later?
    const createdEvent = await prisma.events.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toString()
        }
    })

    return { eventId: createdEvent.id }
})