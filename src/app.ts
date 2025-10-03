import express from 'express';
import { Client } from 'pg';
import { Constantdata } from './Constant/Constant.js';
import { PrismaClient } from '@prisma/client';

const app = express();

app.use(express.json())
const client = new PrismaClient()
const pg_client = new Client(process.env.postgresqlurl)

pg_client.connect();

app.post('/signUp', async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password

    // const data=`INSERT INTO users (username,password,email) VALUES ('${username}', '${password}' ,'${email}')`; sql injection
    await pg_client.query('begin')
    const db_res = await pg_client.query(`INSERT INTO users (name,password,email) VALUES ($1,$2,$3) RETURNING id,name`, [name, password, email]);
    const userid = db_res.rows[0].id
    const last_db = await pg_client.query(`INSERT INTO todos(workname,time,userid) VALUES($1,$2,$3)`, ['sleeping', '10pm', userid])
    res.status(200).json(last_db)
    await pg_client.query('commit')

})

app.get('/metadata', async (req, res, next) => {
    const id = req.query.id;


    // const data=`INSERT INTO users (username,password,email) VALUES ('${username}', '${password}' ,'${email}')`; sql injection
    await pg_client.query('begin')
    const db_res = await pg_client.query(`SELECT u.name,u.email,t.workname,t.time FROM users u FULL JOIN todos t ON u.id=t.userid WHERE u.id=$1`, [id]);

    res.status(200).json(db_res.rows)
    await pg_client.query('commit')

})

app.post('/prismaadd', async (req, res) => {
    console.log("entry")
    const data=await client.user.create({
        data: {
            email: req.body.email,
            password: req.body.password,
            age: 29
        }
    })
    res.status(200).json({response:data})
})

export default app;




// {
//     "name":"ankit",
//     "email":"j.com'); DELETE FROM users ; INSERT INTO users (username,email,password) VALUES('chankit','chankit.com','123",
//     "password":"123"
// }



// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE addresses (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     city VARCHAR(100) NOT NULL,
//     country VARCHAR(100) NOT NULL,
//     street VARCHAR(255) NOT NULL,
//     pincode VARCHAR(20),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );

// innerjoin = default join both entry should be there else return [];
// leftjoin=return left table data if righttable table is not there
// rightjoin=return right table data
// full join=return left if right not there return right if left is not there return both the full data