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
        res.send(categories.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
app.post("/categories", async (req, res) => {
    const { name } = req.body;


    try {

        const categories = await connection.query("SELECT $1 FROM categories;", [name]);
        if(categories){
            res.sendStatus(409);
            return;
        }

        await connection.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [name]
        );
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
})

const port = 4000;
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});