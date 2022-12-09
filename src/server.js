import express from 'express';
import cors from 'cors';
import joi from 'joi';

import categories from "./routers/categories.routers.js";
import games from "./routers/games.routers.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(categories);
app.use(games);








app.get("/customers", async (req, res) => {

    const { cpf } = req.query;
    let user;

    try {
        if (cpf) {
            user = await connection.query(`
            SELECT 
                *
            FROM 
                customers 
            WHERE 
                cpf 
            ILIKE 
                '${cpf}%';`
            );
        } else {
            user = await connection.query(
                `SELECT 
                *
            FROM 
                customers`
            );
        }
        res.send(user.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});
app.get("/customers/:id", async (req, res) => {

    const { id } = req.params;
    let user;

    try {
        user = await connection.query(`
            SELECT 
                *
            FROM 
                customers 
            WHERE 
                id=$1;`,
            [id]
        );
        console.log(user.rows);
        res.send(user.rows[0]).status(404);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});
app.post("/customers", async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;

    try {

        const userCPF = await connection.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
        if (userCPF.rowCount !== 0) {
            console.log(userCPF.rows)
            res.sendStatus(409);
            return;
        }
        if (cpf.length !== 11) {
            res.sendStatus(400);
            return;
        }
        if (phone.length !== 10) {
            if (phone.length !== 11) {
                res.sendStatus(400);
                return;
            }
        }
        if (!name) {
            res.sendStatus(400);
            return;
        }


        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});
app.put("/customers/:id", async (req, res) => {

    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    console.log(req.params);
    console.log("id: " + id);
    /* 
    12345678910
    01234567890 
    */
    try {

        const userCPF = await connection.query(
            "SELECT * FROM customers WHERE cpf=$1 AND id<>$2",
            [cpf, id]
        );

        if (userCPF.rowCount > 0) {
            return res.sendStatus(409);
        }
        if (cpf.length !== 11) {
            res.sendStatus(400);
            return;
        }
        if (phone.length !== 10) {
            if (phone.length !== 11) {
                res.sendStatus(400);
                return;
            }
        }
        if (!name) {
            res.sendStatus(400);
            return;
        }


        await connection.query(
            `UPDATE 
                customers
            SET 
                name=$1, 
                phone=$2, 
                cpf=$3, 
                birthday=$4
            WHERE
                id=$5
            ;`,
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

})


const port = 4000;
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});