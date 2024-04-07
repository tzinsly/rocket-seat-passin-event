import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../data/prisma"
import { createDeflate } from "zlib"

export async function getEventAttendees(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullish().default("0").transform(Number)
                }),
                response: {
                    200: z.object({
                        attendees: z.array(z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            //checkedInAt: z.date().nullable()
                        }))
                    }),
                    404: z.object({
                        error: z.string()
                    })
                }
            }
        }, async (req, res) => {
            console.log(`Get event attendees endpoint invoked with following params: ${JSON.stringify(req.params)}`)
            console.log("Getting event attendees...")

            const params = req.params
            const { pageIndex, query } = req.query

            //validate if event exists
            const attendees = await prisma.attendee.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    /*checkIn: {
                        createAt: true
                    }*/
                },
                where: query ? {
                    eventId: params.eventId,
                    name: {
                        contains: query
                    }
                } : {
                    eventId: params.eventId
                },
                take: 10,
                skip: pageIndex * 10, 
                orderBy: {
                    createdAt: 'desc'
                }
            })

            if (!attendees) {
                return res.status(404).send({ error: "No Attendees found for this event" })
            }

            return res.send({
                attendees: attendees.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        //checkedInAt: attendee.checkIn?.createdAt ?? null- check in is failing
                    }
                })
            })
        })

} 