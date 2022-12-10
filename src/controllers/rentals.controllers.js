import { connection } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    let rental;

    try {
        if (customerId) {
            rental = await connection.query(`
            SELECT 
                rentals.*,
                ROW_TO_JSON(
                    customers.*
                ) AS "customer", 
                JSON_BUILD_OBJECT(
                    'id',games.id,
                    'name',games.name,
                    'categoryId',games."categoryId",
                    'categoryName',categories.name
                )AS "game" 
            FROM 
                rentals
            JOIN 
                customers
            ON 
                customers.id ="customerId"
            JOIN 
                games 
            ON 
                games.id = "gameId" 
            JOIN 
                categories 
            ON 
                categories.id = games."categoryId"
            WHERE 
                cpf 
            ILIKE 
                '${customerId}%';`
            );
        } else if (gameId) {
            rental = await connection.query(`
            SELECT 
                rentals.*,
                ROW_TO_JSON(
                    customers.*
                ) AS "customer", 
                JSON_BUILD_OBJECT(
                    'id',games.id,
                    'name',games.name,
                    'categoryId',games."categoryId",
                    'categoryName',categories.name
                )AS "game" 
            FROM 
                rentals
            JOIN 
                customers
            ON 
                customers.id ="customerId"
            JOIN 
                games 
            ON 
                games.id = "gameId" 
            JOIN 
                categories 
            ON 
                categories.id = games."categoryId"
            WHERE 
                cpf 
            ILIKE 
                '${gameId}%';`
            );
        } else {
            rental = await connection.query(`
            SELECT 
                rentals.*,
                ROW_TO_JSON(
                    customers.*
                ) AS "customer", 
                JSON_BUILD_OBJECT(
                    'id',games.id,
                    'name',games.name,
                    'categoryId',games."categoryId",
                    'categoryName',categories.name
                )AS "game" 
            FROM 
                rentals
            JOIN 
                customers
            ON 
                customers.id ="customerId"
            JOIN 
                games 
            ON 
                games.id = "gameId" 
            JOIN 
                categories 
            ON 
                categories.id = games."categoryId"`
            );
        }
        res.send(rental.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
export async function postRentalsOpen(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rendDate= dayjs().format("YYYY-MM-DD");

    try {

        if(daysRented <= 0){
            res.sendStatus(400);
            return;
        }

        const customers = await connection.query(`
            SELECT 
                *
            FROM 
                customers 
            WHERE 
                id=$1;
            `,
            [customerId]
        );
        if(customers.rowCount === 0){
            res.sendStatus(400);
            return;
        }
        
        const games = await connection.query(`
            SELECT 
                *
            FROM 
                games 
            WHERE 
                id=$1;
            `,
            [gameId]
        );
        if(games.rowCount === 0){
            res.sendStatus(400);
            return;
        }

        const rentals = await connection.query(`
            SELECT 
                *
            FROM 
                rentals 
            WHERE 
                "gameId"=$1;
            `,
            [gameId]
        );
        const stock = games.rows[0].stockTotal - rentals.rowCount;
        if(stock <= 0){
            res.sendStatus(400);
            return;
        }

        const originalPrice = games.rows[0].pricePerDay + Number(daysRented);

        await connection.query(`
        INSERT INTO rentals (
            "customerId", 
            "gameId", 
            "rentDate", 
            "daysRented", 
            "returnDate", 
            "originalPrice", 
            "delayFee"
        ) 
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rendDate, daysRented, null, originalPrice, null]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}


export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}
export async function putCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
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
}