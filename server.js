const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// const jwt = require('jsonwebtoken');

const PORT = 4000
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, this is your server!');
  });

const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "user_logs"
});



                                //_______________Sign up__________________

app.post('/signUp', async (req, res) => {
    const values = [
        req.body.fullname,
        req.body.email,
        req.body.password,
    ];

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";

    try{
        const [rows, fields] = await db.promise().execute(checkEmailQuery, [values[1]]);

        if(rows && rows.length > 0){
           return res.status(409).send("User already exists");
        }

        const sql = "INSERT INTO users (`full_name`, `email`, `password`) VALUES (?)";
        db.promise().query(sql, [values]) 
        console.log("Data inserted")
        res.status(200).send("Sign up successful");

     }

    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }

   
});



                            //_______________Login__________________

app.post('/Login', async (req, res) => {
    const values = [
        req.body.email,
        req.body.password,
    ];

    const loginQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
 
    try{
        const [rows] = await db.promise().execute(loginQuery, [values[0], values[1]]);
        if(rows && rows.length > 0){
            const user = {
                email: values[0]
           }

        //    const token = jwt.sign(user, 'Secr@tP@ss');
        //    res.json({token});
           return res.status(200).send("Logged in");
         }
         else{
            return res.status(401).send("invalid info");
         }
    }

    catch(error){
        console.error(error);
    }
});


// db.end((err) => {
//     if(err){
//       console.log(err);
//     }
//     else{
//         console.log("Connection closed");
//     }
// });


app.listen(PORT, () => {
    console.log("server is running at port:", PORT);
})