const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const fs = require("fs")

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

function imageToBytes(filePath) {
    const data = fs.readFileSync(filePath).toString('binary')
    console.log(data)
}

function savePhoto(data, userId, uploadDate) {
    db.run(`INSERT INTO Images (image, timestamp, userId) VALUES ('${data}', '${uploadDate}', ${userId})`);
}

// savePhoto("asdfeff", 16, 'fhasdfk')

// imageToBytes('../frontend/assets/example-user-icon.jpg')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, "$2b$10$DvnXTDsn2.tKRq6zXnEFJOM62eDSZfIAtDqC3WVZZ1V5Qcv/kBfHi", (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.body.username = user
  
      next()
    })
  }

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

//TODO work in user id?? if needed idk if it needs to be in the endpoint url or not
router.route('/home').get(authenticateToken, (req, res) => {
    res.send("You should only see this with a valid token")
})


//TODO cleanup
router.route('/signup').post(async (req, res) => {
    console.log(req.body)

    //checks for email uniqueness
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, async (err, row) => {
        if (err) { //db error
            error = err
            console.log(error)
            res.status(500).send({ "message": "Database error!", "success": false })
            return
        }
        if (!row) { //email is unique now check username
            db.get(`SELECT * FROM Users WHERE username = '${req.body.username}'`, async (err, row) => {
                if (err) { //db error
                    error = err
                    console.log(error)
                    res.status(500).send({ "message": "Database error!", "success": false })
                    return
                }
                if (!row) { //email and username are unique
                    const saltRounds = 10
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
                    // console.log(hashedPassword)
                    db.run(`INSERT INTO Users (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${hashedPassword}')`)

                    let token;
                    try {
                        //Creating jwt token
                        token = jwt.sign(
                            {
                                userId: req.body.username,
                                email: req.body.email
                            },
                            "$2b$10$DvnXTDsn2.tKRq6zXnEFJOM62eDSZfIAtDqC3WVZZ1V5Qcv/kBfHi",
                            { expiresIn: "1h" }
                        );
                    } catch (err) {
                        console.log(err);
                        res.status(400).send({ "message": err, "success": false, "username": req.body.username })
                        return;
                    }

                    res.status(200).send({ "message": "User Created", "success": true, "username": req.body.username, "token": token })
                    return
                }
                else {
                    // username already exists
                    res.status(200).send({ "message": "Username already exists!", "success": false })
                    return
                }
            })
            return
        }
        else {
            //email exists already
            res.status(200).send({ "message": "Account with this email already exists!", "success": false })
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
        if (err) {
            error = err
            console.log(error)
            res.status(500).send({ "message": "Database error!", "success": false })
            return
        }
        if (!row) {
            res.status(200).send({ "message": "An account with this email does not exist!", "success": false, "errCode": 1 })
            return
        }
        const match = await bcrypt.compare(req.body.password, row.password)
        if (match) {
            let token;
            try {
                //Creating jwt token
                token = jwt.sign(
                    {
                        userId: row.username,
                        email: row.email
                    },
                    "$2b$10$DvnXTDsn2.tKRq6zXnEFJOM62eDSZfIAtDqC3WVZZ1V5Qcv/kBfHi",
                    { expiresIn: "1h" }
                );
            } catch (err) {
                console.log(err);
                res.status(400).send({ "message": err, "success": false, "username": row.username })
                return;
            }


            res.status(200).send({ "message": "User Logged In", "success": true, "username": row.username, "token": token })
            return
        }
        res.status(200).send({ "message": "Password incorrect!", "success": false })
        return
    })
})

router.route('/upload').post(async (req, res) => {


    console.log(req.body)
    return "Hello world"
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})