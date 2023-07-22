import { cleanDb } from '../helpers';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';
import { init } from '@/app';

beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('GET /booking', () => {
  jest.spyOn(bookingRepository, 'getBooking').mockImplementation((): any => {
    return null;
  });

  it('Não encontrado', async () => {
    const promise = bookingService.getBooking(5);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
