import {connection} from "../database/database.js";

export async function getCustomers(req, res){
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
}
export async function getCustomersID(req, res){
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
        res.send(user.rows[0]).status(404);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
export async function postCustomers(req, res){
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
export async function putCustomers(req, res){
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