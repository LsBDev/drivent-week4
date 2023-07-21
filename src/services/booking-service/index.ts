import { notFoundError } from '../../errors';
import { forbiddenError } from '../../errors/forbidden-error';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  //Regra de negócio: Apenas usuários com ingresso do tipo presencial, com hospedagem e pago podem fazer reservas.
  //Pegar o enrollmentId
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticketWithTicketType = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (
    ticketWithTicketType.TicketType.isRemote ||
    !ticketWithTicketType.TicketType.includesHotel ||
    ticketWithTicketType.status === 'RESERVED'
  )
    throw forbiddenError();
  //Error:
  //- `roomId` não existente: Deve retornar status code `404`.
  const room = await bookingRepository.getRoomByRoomId(roomId);
  if (!room) throw notFoundError();
  const bookings = await bookingRepository.getAllBookingsByRoomId(roomId);
  //- `roomId` sem vaga: Deve retornar status code `403`.
  if (room.capacity <= bookings.length) throw forbiddenError();

  //- Fora da regra de negócio: Deve retornar status code `403`.
  return await bookingRepository.createBooking(userId, roomId);
  //Sucesso: Deve retornar status code 200 com bookingId
  // return booking.id
}

const bookingService = {
  getBooking,
  createBooking,
};

export default bookingService;
