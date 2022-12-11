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
    const {customerId, gameId, rendDate, daysRented,originalPrice} = req.obj;

    try {

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
export async function postRentalsClose(req, res) {
    const {now, delayFee, id} = req.obj;

    try {

        await connection.query(`
            UPDATE 
                rentals
            SET 
                "returnDate"=$1, 
                "delayFee"=$2
            WHERE
                id=$3
            ;`,
            [now, delayFee, id]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}
export async function deleteRentals(req, res) {
    const { id } = req.params;
    try {
        await connection.query(`
            DELETE FROM
                rentals
            WHERE
                id=$1
            ;`,
            [id]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}