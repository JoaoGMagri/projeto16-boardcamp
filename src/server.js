import express from 'express';
import cors from 'cors';
import joi from 'joi';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});


app.get("/categories", async (req, res) => {
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        console.log(categories);
        res.send(categories.rows);
    } catch (error) {
        console.log(error);
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});