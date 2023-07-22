import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createSession,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { buildBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

const server = supertest(app);

beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('GET /booking', () => {
  describe('token inválido', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  // describe("token válido", () => {
  //   it("retorna todas as reservas", async () => {
  //     //criar usuário e reserva
  //     const user = await createUser()
  //     const token = generateValidToken(user) // já cria sessão e usuário se não mandar
  //     const enrollmentWithAddress = await createEnrollmentWithAddress(user)
  //     const ticketType = await createTicketType()
  //     const ticket = await createTicket(enrollmentWithAddress.id, ticketType.id, TicketStatus.PAID)
  //     const hotel = await createHotel()
  //     const room = await createRoomWithHotelId(hotel.id)
  //     const booking = await buildBooking(room.id, user.id)

  //     const result = await server.get("/booking").set('Authorization', `Bearer ${token}`)
  //     expect(result.status).toBe(httpStatus.OK)
  //     expect(result.body).toEqual({
  //       id: booking.id,
  //       userId: user.id,
  //       createAt: booking.createdAt,
  //       updateAt: booking.updatedAt,
  //       room: {
  //         id: room.id,
  //         name: room.name,
  //         capacity: room.capacity,
  //         hotelId: room.hotelId,
  //         createAt: room.createdAt,
  //         updateAt: room.updatedAt
  //       }
  //     })
  //   })
  // })
});

// bookingRouter.get("/booking", getBooking)
// Status 200 e retorna a reserva com os quartos
// Status 404 quando não encontra reserva

// bookingRouter.post("/booking", "createBooking")
// Status 200 e retorna {bookingId: id: number}
// Status 403 para usuário com ticket remoto, que não inclui hotel ou não pago e quando a capacidade do quarto já foi esgotada.
// Status 404 quando não encontra o quarto com o roomId

// bookingRouter.update("/booking", updateBooking)
// Status 403 se não existe reserva no nome do usuário ou a capacidade do quarto foi está esgotada.
// Status 404 não tem quarto com o id.
