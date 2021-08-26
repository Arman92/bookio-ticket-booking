import dotenv from 'dotenv';

// First of all append .env file contents to environment variables
dotenv.config();

import './infra/http/app';
import './infra/mongoose';
