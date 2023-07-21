import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import bookingController from '../controllers/booking-controllers';

const bookingRouter = Router();
bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', bookingController.getBooking);
bookingRouter.post('/', bookingController.createBooking);
// bookingRouter.get('/:bookingId', )

export { bookingRouter };
