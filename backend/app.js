const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const fs = require("fs")
const multer = require('multer') //import for storing images
const path = require('path')

// Set the web server
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
const port = 3000

// Set up db
const db = new sqlite3.Database('./database.db')

const router = express.Router()

app.use('/', router)

// dictates the storage for a photo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public') // saying we want to store in ./public/ directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname) //creates filename for the photo
    }
})

const upload = multer({ storage: storage }).single('file') //Tbh idk what this does

function imageToBytes(filePath) {
    const data = fs.readFileSync(filePath).toString('binary')
    // console.log(data)
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

    // console.log(authHeader)
    jwt.verify(token, "$2b$10$DvnXTDsn2.tKRq6zXnEFJOM62eDSZfIAtDqC3WVZZ1V5Qcv/kBfHi", (err, userId) => {
        // console.log(`Authenticate token ERROR: ${err}`);

        if (err) return res.sendStatus(403)

        req.body.userId = userId;

        next();
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
    // console.log(req.body.userId.userId)
    res.send({ "Message": "You should only see this with a valid token", "username": req.body.userId.userId })
})


//TODO cleanup
router.route('/signup').post(async (req, res) => {
    // console.log(req.body)

    //checks for email uniqueness
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, async (err, row) => {
        if (err) { //db error
            console.log(`/signup ERROR: ${err}`);
            res.status(500).send({ "message": "Database error!", "success": false })
            return
        }
        if (!row) { //email is unique now check username
            db.get(`SELECT * FROM Users WHERE username = '${req.body.username}'`, async (err, row) => {
                if (err) { //db error
                    console.log(`/signupError: ${err}`);
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
                            { expiresIn: "48h" }
                        );
                    } catch (err) {
                        console.log(`/signupError: ${err}`);
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
    let error = null
    let password = null
    db.get(`SELECT * FROM Users WHERE email = '${req.body.email}'`, async (err, row) => {
        if (err) {
            console.log(`/login ERROR: ${err}`);
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
                console.log(`/login ERROR: ${err}`);
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

router.route('/profile').post(authenticateToken, async (req, res) => {
    db.all(`
        SELECT Images.path, Images.timestamp, Images.caption, Images.id FROM Images 
        inner join Users 
        on Users.id = Images.userId 
        where Users.username = '${req.body.pageUserName}'
        order by Images.timestamp;
        `, async (err, row) => {
        if (err) {
            console.log(`/profile ERROR: ${err}`);
            res.status(500).send({ "message": "Database error!", "success": false })
            return
        }
        const imagePaths = formateImagePathsFromDBRows(row)

        db.get(`select bio from Users where username = '${req.body.pageUserName}';`, async (err, row) => {
            if (err) {
                console.log(`/profile ERROR: ${err}`);
                res.status(500).send({ "message": "Database error!", "success": false })
                return
            }
            res.status(200).send({ "username": req.body.userId.userId, "bio": row ? row.bio : null, "images": imagePaths, "ownProfile": req.body.pageUserName === req.body.userId.userId })
            return
        })
        return
    })
})

function formateImagePathsFromDBRows(rows) {
    let paths = []
    for (let i = 0; i < rows.length; i++) {
        paths.push({
            "path": rows[i].path.slice(7),
            "caption": rows[i].caption,
            "timestamp": rows[i].timestamp,
            "id": rows[i].id
        })
    }

    return paths
}

function getDateTimeForDB() {
    const date = new Date()
    const day = ("0" + date.getDate()).slice(-2)
    const month = ("0" + date.getMonth() + 1).slice(-2)
    const year = date.getFullYear()
    const hour = date.getHours()
    const min = date.getMinutes()
    const second = date.getSeconds()
    return `${year}-${month}-${day} ${hour}:${min}:${second}`
}

router.route('/upload').post(async (req, res) => {
    upload(req, res, (err) => { //initiates the storage function for the photo
        if (err) {
            console.log(`/upload ERROR: ${err}`);
            res.sendStatus(500)
        }
        const username = JSON.parse(req.body.body).username
        const caption = JSON.parse(req.body.body).caption
        const filePath = req.file.path
        const timestamp = getDateTimeForDB()

        db.get(`SELECT id FROM Users WHERE username = '${username}'`, async (err, row) => {
            if (err) {
                console.log(`/upload ERROR: ${err}`);
                res.status(500).send({ "message": "Database error!", "success": false })
                return
            }
            const userId = row.id
            db.run(`INSERT INTO Images (path, timestamp, userId, caption) VALUES ('${filePath}', '${timestamp}', ${userId}, '${caption}')`)
        })
        res.send(req.file)
    })
})

router.route('/i/:challengeId').get(authenticateToken, async (req, res) => {
    if (isNaN(req.params.challengeId)) {
        res.sendStatus(500)
        return
    }
    db.get(`SELECT path, timestamp, caption, id FROM Images WHERE id = ${Number(req.params.challengeId)};`,
        async (err, row) => {
            if (err) {
                console.log(`/i/[challengeId] ERROR: ${err}`);
                res.status(500).send({ "message": "Database error!", "success": false });
            }
            else {
                res.status(200).send(formateImagePathsFromDBRows([row])[0]);
            }
        }
    )
})

router.route('/savebio').post(authenticateToken, async (req, res) => {
    db.run(`UPDATE Users SET bio = '${req.body.bio}' WHERE username = '${req.body.userId.userId}';`)
    res.status(200).send({ "message": "Bio updated" })

})

router.route('/feed').get(authenticateToken, async (req, res) => {
    // currentUserId = req.userId
    // db.get(`SELECT path, timestamp, caption, id FROM Images WHERE userId IN (SELECT friendId FROM Friends WHERE userID = :currentUserId)`)
    // console.log('Getting feed...');
    db.get(`SELECT id FROM Users WHERE username = '${req.body.userId.userId}';`, 
        async (err, row) => {
            if (err) {
                console.log(`/feed ERROR: ${err}`);
                res.status(500).send({ 'message': 'Database error!', 'success': false });
            }
            else {
                console.log(row)
                let userId = row.id
                db.all(`
                        SELECT i.path, i.timestamp, i.caption, i.id FROM Images i 
                        INNER JOIN Associations a
                        ON a.targetUserId = i.userId
                        WHERE a.type = 1 and a.userId = ${userId}
                        ORDER BY i.timestamp;`,
                    async (err, row) => {
                        if (err) {
                            console.log(`/feed ERROR: ${err}`);
                            res.status(500).send({ 'message': 'Database error!', 'success': false });
                        }
                        else {
                            res.status(200).send(formateImagePathsFromDBRows(row));
                        }
                    })
            }
        })
})


app.use(express.static('public'));


app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})