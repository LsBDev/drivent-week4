import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';

async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);
    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name == 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Algo de errado não está certo!');
  }
}

async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);
  try {
    const booking = await bookingService.createBooking(userId, roomId);
    res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name == 'forbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    if (error.name == 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Algo de errado não está certo!');
  }
}

async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  const roomId = Number(req.body.roomId);

  try {
    const booking = await bookingService.updateBooking(userId, bookingId, roomId);
    res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Algo de errado não está certo!');
  }
}

const bookingController = {
  getBooking,
  createBooking,
  updateBooking,
};
export default bookingController;
