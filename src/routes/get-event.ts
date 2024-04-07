import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../data/prisma";

export async function getEvent(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200:
                        z.object({
                            event: z.object({
                                title: z.string(),
                                details: z.string().nullable(),
                                slug: z.string(),
                                maximumAttendees: z.number().int().positive().nullable(),
                                registeredAttendees: z.number().int().positive()
                               
                            })
                        }),
                    404: z.object({
                        error: z.string()
                    })
                }
            }
        }, async (req, res) => {
            console.log(`Get event endpoint invoked with following params: ${JSON.stringify(req.params)}`)
            console.log("Getting event details...")

            const params = req.params

            //validate if event exists
            const event = await prisma.event.findUnique({
                select: {
                    title: true,
                    details: true,
                    maximumAttendees: true,
                    slug: true,
                    _count: {
                        select: {
                            attendees: true
                        }
                    }
                },
                where: {
                    id: params.eventId
                }
            })

            if (!event) {
                return res.status(404).send({ error: "Event not found" })
            }

            const attendees = await prisma.attendee.findMany({
                where: {
                    eventId: params.eventId
                }
            })

            return res.send({
                event: {  
                    title: event.title,
                    details: event.details,
                    slug: event.slug,
                    maximumAttendees: event.maximumAttendees,
                    registeredAttendees: event._count.attendees,
                },
            })
        })
}