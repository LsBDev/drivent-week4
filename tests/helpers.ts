import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { createUser } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';

export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}
// export async function cleanDb() {
//   const tablenames = await prisma.$queryRaw<
//     Array<{ tablename: string }>
//   >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

//   const tables = tablenames
//     .map(({ tablename }) => tablename)
//     .filter((name) => name !== '_prisma_migrations')
//     .map((name) => `"public"."${name}"`)
//     .join(', ');

//   try {
//     await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
//   } catch (error) {
//     console.log({ error });
//   }
// }

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
