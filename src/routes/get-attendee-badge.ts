import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../data/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/badge', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int().positive()
                }),
                response: {
                    200: z.object({
                        badge: z.object({
                            name: z.string(),
                            email: z.string().email(),
                            eventTitle: z.string(),
                            checkInUrl: z.string().url()
                        })
                    }),
                    404: z.object({
                        error: z.string()
                    })
                }
            }

        }, async (req, res) => {
            console.log(`Get attendee badge endpoint invoked with following params: ${JSON.stringify(req.params)}`)
            console.log("Getting attendee badge...")
            const params = req.params

            const attendee = await prisma.attendee.findUnique({
                select: {
                    name: true,
                    email: true,
                    event: {
                        select: {
                            title: true
                        }
                    }
                },
                where: {
                    id: params.attendeeId
                }
            })

            if (!attendee) {
                return res.status(404).send({ error: "Attendee not found" })
            }

            const baseUrl = req.protocol + '://' + req.hostname;
            const checkInUrl = new URL(`/attendees/${params.attendeeId}/check-in`, baseUrl)

            return res.send({
                badge: {
                    name: attendee.name,
                    email: attendee.email,
                    eventTitle: attendee.event.title,
                    checkInUrl: checkInUrl.toString()
                }
            })

        })

}