const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3')

// Set the web server
const app = express();
app.use(express.json());
const port = 3000

// Set up db
const db = new sqlite3.Database('./database.db')

// app.get('/', (req, res) => {
//     res.send("Hello World")
// })

const router = express.Router()

app.use('/', router)

router.route('/').get((req, res) => {
    res.send("hello world on router")
})

/*
{
    "email":
    "username"
    "password"
}
*/
router.route('/signup').post((req, res) => {
    //add to db
    console.log(req.body)
    db.run(`INSERT INTO Users (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}')`)
    res.status(200).send("User created")
})

router.route('/login').post((req, res) => {
    //add to db
    console.log(req.body)
    let error = null
    let password = null
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, (err, row) => {
        if(err) {
            error = err
            console.log(error)
            res.status(500).send("Database error")
            return
        }
        if(!row){
            res.status(200).send("No user found")
            return
        }
        console.log(row.password)
        if(row.password === req.body.password){
            res.status(200).send("User Logged In")
            return
        }
        res.status(200).send("Password incorrect")
        return
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})