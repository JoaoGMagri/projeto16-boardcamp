import express from 'express';
import cors from 'cors';
import joi from 'joi';

import categories from "./routers/categories.routers.js";
import games from "./routers/games.routers.js";
import customers from './routers/customers.routers.js';
import rentals from './routers/rentals.routers.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(categories);
app.use(games);
app.use(customers);
app.use(rentals);

const port = 4000;
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});