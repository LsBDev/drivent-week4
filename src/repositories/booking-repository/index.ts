import { prisma } from '@/config';

function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

function getRoomByRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

function getAllBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    data: {
      roomId,
      updatedAt: new Date(),
    },
    where: {
      id: bookingId,
    },
  });
}

const bookingRepository = {
  getBooking,
  getRoomByRoomId,
  getAllBookingsByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
