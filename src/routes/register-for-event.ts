import { FastifyInstance} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../data/prisma';

export async function registerForEvent(app: FastifyInstance) {

    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/register', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params: z.object({ 
                eventId: z.string().uuid(),
            }),
            response: {
                201: z.object({
                    attendeeId: z.number(),
                }),
                404: z.object({
                    error: z.string()
                }),
                409: z.object({
                    error: z.string()
                })
            }

        }

    }, async (req, res) => {
        console.log(`Register for event endpoint invoked with following body: ${JSON.stringify(req.body)}`)
        console.log("Registering for event...")

        const data = req.body;
        const params = req.params;

        //validate if event exists
        const eventExists = await prisma.event.findFirst({
            where: {
                id: params.eventId
            }
        })

        if (!eventExists) {
            return res.status(404).send({ error: "Unable to register attendee - Event not found" })
        }

        //validate user register to event only once
        const attendeeExists = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    eventId: params.eventId,
                    email: data.email
                }   
            }
        })

        if (attendeeExists) {   
            return res.status(409).send({ error: "User already registered for this event" })
        }

        //validate if event is full
        const numberOfAttendeesForThisEvent = await prisma.attendee.count({
            where: {
                eventId: params.eventId
            }
        })

        if (eventExists.maximumAttendees !== null && numberOfAttendeesForThisEvent >= eventExists.maximumAttendees) {   
            return res.status(500).send({ error: "Max attendees already reached for this event" })
        }

        const attendee = await prisma.attendee.create({
            data: {
                name: data.name,
                email: data.email,
                eventId: params.eventId
            }
        })

        return res.status(201).send({ attendeeId: attendee.id })   
        
    })

}