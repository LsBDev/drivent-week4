import { cleanDb } from '../helpers';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';
import { init } from '@/app';
// import enrollmentRepository from '../repositories/enrollment-repository';
// import ticketsRepository from '../repositories/tickets-repository';

beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('GET /booking', () => {
  it('Não encontrado', async () => {
    jest.spyOn(bookingRepository, 'getBooking').mockImplementation((): any => {
      return null;
    });
    const promise = bookingService.getBooking(5);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('Retorna a reserva encontrada', async () => {
    jest.spyOn(bookingRepository, 'getBooking').mockImplementation((userId): any => {
      return {
        id: 1,
        Room: {
          id: 1,
          name: 'teste',
          hotelId: 1,
          capacity: 4,
          createdAt: '2023-07-20T09:30:00.000Z',
          updatedAt: '2023-07-20T09:30:00.000Z',
        },
      };
    });
    const result = await bookingService.getBooking(5);
    expect(result).toMatchObject({
      id: 1,
      Room: {
        id: 1,
        name: 'teste',
        hotelId: 1,
        capacity: 4,
        createdAt: '2023-07-20T09:30:00.000Z',
        updatedAt: '2023-07-20T09:30:00.000Z',
      },
    });
  });
});
