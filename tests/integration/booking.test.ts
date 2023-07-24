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
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { buildBooking } from '../factories/booking-factory';
import app, { init } from '@/app';
import { disconnectDB } from '@/config';

const server = supertest(app);

beforeEach(async () => {
  await init();
  await cleanDb();
});

afterEach(async () => {
  await disconnectDB();
});

// bookingRouter.get("/booking", getBooking)
// Status 200 e retorna a reserva com os quartos
// Status 404 quando não encontra reserva

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

  describe('token válido', () => {
    it('retorna todas as reservas', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await buildBooking(room.id, user.id);

      const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body).toMatchObject({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          hotelId: room.hotelId,
          capacity: room.capacity,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

// bookingRouter.post("/booking", "createBooking")
// Status 200 e retorna {bookingId: id: number}
// Status 403 para usuário com ticket remoto, que não inclui hotel ou não pago e quando a capacidade do quarto já foi esgotada.
// Status 404 quando não encontra o quarto com o roomId

describe('POST /booking', () => {
  describe('token inválido', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('token válido', () => {
    it('cria a reserva', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });

    it('erro FORBIDDEN ao criar a reserva', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});

// bookingRouter.update("/booking", updateBooking)
// Status 403 se não existe reserva no nome do usuário ou a capacidade do quarto foi está esgotada.
// Status 404 não tem quarto com o id.

describe('PUT /booking/:bookingId', () => {
  describe('token inválido', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.put('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('token válido', () => {
    it('edita a reserva e retorna o bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const newRoom = await createRoomWithHotelId(hotel.id);
      const booking = await buildBooking(room.id, user.id);
      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });

    it('bookingId não encontrado', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      // const room = await createRoomWithHotelId(hotel.id);
      const newRoom = await createRoomWithHotelId(hotel.id);
      // const booking = await buildBooking(room.id, user.id);
      const response = await server
        .put('/booking/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});
