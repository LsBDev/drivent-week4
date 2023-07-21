import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';

describe('GET /booking', () => {
  jest.spyOn(bookingRepository, 'getBooking').mockImplementation((): any => {
    return [
      {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        roomId: [
          {
            id: 1,
            name: faker.commerce.productName(),
            capacity: 2,
            hotelId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ];
  });

  it('deveria retornar as reservas', async () => {
    const booking = await bookingService.getBooking(1);
    expect(booking).toEqual([
      {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        roomId: [
          {
            id: 1,
            name: faker.commerce.productName(),
            capacity: 2,
            hotelId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ]);
  });
});
