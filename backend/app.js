const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')

// Set the web server
const app = express();
app.use(express.json());
app.use(cors());
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

//TODO cleanup
router.route('/signup').post( async (req, res) => {
    console.log(req.body)

    //checks for email uniqueness
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, async (err, row) => {
        if(err) { //db error
            error = err
            console.log(error)
            res.status(500).send({"message":"Database error!", "success": false})
            return
        }
        if(!row){ //email is unique now check username
            db.get(`SELECT * FROM Users WHERE username = '${req.body.username}'`, async (err, row) => {
                if(err) { //db error
                    error = err
                    console.log(error)
                    res.status(500).send({"message":"Database error!", "success": false})
                    return
                }
                if(!row){ //email and username are unique
                    const saltRounds = 10
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
                    // console.log(hashedPassword)
                    db.run(`INSERT INTO Users (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${hashedPassword}')`)
                    res.status(200).send({"message":"User Created", "success": true, "username": req.body.username})
                    return
                }
                else {
                    // username already exists
                    res.status(200).send({"message":"Username already exists!", "success": false})
                    return
                }
            })
            return
        }
        else {
            //email exists already
            res.status(200).send({"message":"Account with this email already exists!", "success": false})
            return
        }
    })
})

router.route('/login').post(async (req, res) => {
    //add to db
    console.log(req.body)
    let error = null
    let password = null
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, async (err, row) => {
        if(err) {
            error = err
            console.log(error)
            res.status(500).send({"message":"Database error!", "success": false})
            return
        }
        if(!row){
            res.status(200).send({"message":"An account with this email does not exist!", "success": false, "errCode": 1})
            return
        }
        const match = await bcrypt.compare(req.body.password, row.password)
        if(match){
            res.status(200).send({"message":"User Logged In", "success": true, "username": row.username})
            return
        }
        res.status(200).send({"message":"Password incorrect!", "success": false})
        return
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})