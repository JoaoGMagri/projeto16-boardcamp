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

        const categories = await connection.query("SELECT * FROM categories WHERE name=$1;", [name]);
        if (categories.rowCount !== 0) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [name]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get("/games", async (req, res) => {

    const { name } = req.query;
    let games;

    try {
        if (name) {
            games = await connection.query(`SELECT * FROM games JOIN categories ON games.categoryId=$1 WHERE name ILIKE '${name}%';`, [categories.id]);
        } else {
            games = await connection.query(
            `SELECT 
                games.id,
                games.name,
                games.image,
                games."stockTotal",
                games."pricePerDay",
                categories.name AS "categoryName"
            FROM 
                games 
            JOIN 
                categories 
            ON 
                games."categoryId"=categories.id;`);
        }
        console.log(games);
        res.send(games.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});
app.post("/games", async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {

        const game = await connection.query(`SELECT * FROM games WHERE name=$1;`, [name]);
        if (game.rowCount !== 0) {
            res.sendStatus(409);
            return;
        }

        const categoriesID = await connection.query("SELECT * FROM categories WHERE id=$1;", [categoryId]);
        if (categoriesID.rowCount === 0) {
            res.sendStatus(400);
            return;
        }


        if (!name) {
            res.sendStatus(400);
            return;
        }
        if (stockTotal <= 0) {
            res.sendStatus(400);
            return;
        }
        if (pricePerDay <= 0) {
            res.sendStatus(400);
            return;
        }

        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});