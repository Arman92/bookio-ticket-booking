import express from 'express';
import { bookController } from '../../controllers/book-controller';
import { createStationController } from '../../controllers/create-station-controller';
import { createTripController } from '../../controllers/create-trip-controller';
import { getCityStationsController } from '../../controllers/get-city-stations-controller';
import { refundBookingController } from '../../controllers/refund-booking-controller';
import { searchCitiesController } from '../../controllers/search-cities-controller';
import { searchTripsController } from '../../controllers/search-trip-controller';

const stationsRouter = express.Router();
const citiesRouter = express.Router();
const tripsRouter = express.Router();

// Station routes
stationsRouter.post(
  '/',
  createStationController.execute.bind(createStationController)
);

// City routes
citiesRouter.get(
  '/:cityId/stations',
  getCityStationsController.execute.bind(getCityStationsController)
);
citiesRouter.get(
  '/search',
  searchCitiesController.execute.bind(searchCitiesController)
);

// Trip routes
tripsRouter.post('/', createTripController.execute.bind(createTripController));
tripsRouter.get(
  '/search',
  searchTripsController.execute.bind(searchTripsController)
);
tripsRouter.post('/book', bookController.execute.bind(bookController));
tripsRouter.post(
  '/refund',
  refundBookingController.execute.bind(refundBookingController)
);

export { stationsRouter, citiesRouter, tripsRouter };
