import { prisma } from '@/config';

export async function buildBooking(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      roomId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function updateBooking(roomId: number, id: number) {
  return await prisma.booking.update({
    data: {
      roomId,
      updatedAt: new Date(),
    },
    where: {
      id,
    },
  });
}
