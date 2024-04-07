import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlugFromTitle } from "../utils";
import { prisma } from "../data/prisma";
import { FastifyInstance } from 'fastify';

export async function createEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                summary: "Create a new event",
                tags: ['events'],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid()
                    }),
                    409: z.object({
                        error: z.string()
                    })
                }
            }
        }, async (req, res) => { //async is needed here as we are using 'await' for prisma record create

            console.log(`Create event endpoint invoked with following body: ${JSON.stringify(req.body)}`)
            console.log("Creating event...")

            const data = req.body;
            const urlFriendlySlug = generateSlugFromTitle(data.title)

            const eventWithSameSlug = await prisma.event.findFirst({
                where: {
                    slug: urlFriendlySlug
                }
            })

            if (eventWithSameSlug) {
                return res.status(409).send({ error: "An event with the same slug already exists" })
            }


            //Creating data inside prisma itself - should we move to a different file later?
            const createdEvent = await prisma.event.create({
                data: {
                    title: data.title,
                    details: data.details,
                    maximumAttendees: data.maximumAttendees,
                    slug: urlFriendlySlug
                }
            })

            return res.status(201).send({ eventId: createdEvent.id })
        })
}

