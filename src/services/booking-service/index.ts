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
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticketWithTicketType = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (
    ticketWithTicketType.TicketType.isRemote ||
    !ticketWithTicketType.TicketType.includesHotel ||
    ticketWithTicketType.status === 'RESERVED'
  )
    throw forbiddenError();
  const room = await bookingRepository.getRoomByRoomId(roomId);
  if (!room) throw notFoundError();
  const bookings = await bookingRepository.getAllBookingsByRoomId(roomId);
  if (room.capacity <= bookings.length) throw forbiddenError();
  return await bookingRepository.createBooking(userId, roomId);
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const bookings = await bookingRepository.getAllBookingsByRoomId(roomId);
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw forbiddenError();
  const room = await bookingRepository.getRoomByRoomId(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= bookings.length) throw forbiddenError();

  return await bookingRepository.updateBooking(bookingId, roomId);
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
