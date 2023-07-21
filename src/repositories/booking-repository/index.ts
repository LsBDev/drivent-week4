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
    },
  });
}

const bookingRepository = {
  getBooking,
  getRoomByRoomId,
  getAllBookingsByRoomId,
  createBooking,
};

export default bookingRepository;
