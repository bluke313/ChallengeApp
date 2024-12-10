const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const fs = require("fs")
const multer = require('multer') //import for storing images
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')

// Set the web server
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "15MB" }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
const port = 3000

// Set up db
const db = new sqlite3.Database('./database.db')

//check if there are any active challenges
async function getActiveChallenge() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Challenges WHERE active = 1;', async (err, row) => {
            if (err) {
                console.log("ERROR: isActiveChallenge", err)
                reject(err)
            }
            else {
                if (row == undefined) {
                    resolve(null)
                }
                resolve(row)
            }
        })
    }
    )
}

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

//TODO consider deletion
function imageToBytes(filePath) {
    const data = fs.readFileSync(filePath).toString('binary')
    // console.log(data)
}

//TODO consider deletion
function savePhoto(data, userId, uploadDate) {
    db.run(`INSERT INTO Images (image, timestamp, userId) VALUES ('${data}', '${uploadDate}', ${userId})`);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        console.log("authentication failed: ", req.headers['authorization'])
        return res.sendStatus(401)
    }


    // console.log(authHeader)
    jwt.verify(token, "$2b$10$DvnXTDsn2.tKRq6zXnEFJOM62eDSZfIAtDqC3WVZZ1V5Qcv/kBfHi", (err, userId) => {
        // console.log(`Authenticate token ERROR: ${err}`);

        if (err) return res.status(403).send({ "message": "You do not have permission to view this page." })

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

    const pageUserName = req.body.pageUserName ? req.body.pageUserName : req.body.userId.userId;

    db.all(`
        SELECT Images.path, Images.timestamp, Images.caption, Images.id FROM Images 
        inner join Users 
        on Users.id = Images.userId 
        where Users.username = '${pageUserName}'
        order by Images.timestamp;
        `, async (err, row) => {
        const ownProfile = pageUserName === req.body.userId.userId
        if (err) {
            console.log(`/profile ERROR: ${err}`);
            res.status(500).send({ "message": "Database error!", "success": false })
            return
        }
        const imagePaths = formateImagePathsFromDBRows(row)

        db.get(`SELECT bio, pfpPath FROM Users WHERE username = '${pageUserName}';`, async (err, row) => {
            if (err) {
                console.log(`/profile ERROR: ${err}`);
                res.status(500).send({ "message": "Database error!", "success": false })
                return
            }
            else { // get amount of friends
                const bioRow = row
                db.get(`SELECT COUNT(*) as friendCount FROM Associations WHERE userId = (SELECT id from Users where username = '${pageUserName}') and type = 1;`,
                    async (err, row) => {
                        if (err) {
                            console.log(`/profile ERROR: ${err}`);
                            res.status(500).send({ "message": "Database error!", "success": false })
                            return
                        }
                        if (ownProfile) {
                            res.status(200).send({ "username": req.body.userId.userId, "bio": bioRow?.bio ? bioRow.bio : "", "pfpPath": bioRow.pfpPath.slice(7), "images": imagePaths, "ownProfile": ownProfile, "friendCount": row.friendCount })
                        }
                        else {
                            const friendCountRow = row

                            //gets association status if it's someone else's profile
                            db.get(`
                                    SELECT Associations.type FROM Associations
                                    INNER JOIN Users
                                    ON Users.id = Associations.userId
                                    WHERE Users.username = '${req.body.userId.userId}'
                                    AND Associations.targetUserId = (SELECT id FROM Users WHERE username = '${pageUserName}');
                                `, async (err, row) => {
                                if (err) {
                                    console.log(`/profile ERROR: ${err}`);
                                    res.status(500).send({ "message": "Database error!", "success": false })
                                    return
                                }
                                let friends = -1 //-1 means no association
                                if (row !== undefined) {
                                    friends = row.type
                                }
                                res.status(200).send({ "username": req.body.userId.userId, "bio": bioRow ? bioRow.bio : "", "pfpPath": bioRow.pfpPath.slice(7), "images": imagePaths, "ownProfile": ownProfile, "friends": friends, "friendCount": friendCountRow.friendCount })

                            })
                        }
                    })
            }

            return
        })
        return
    })
})

function formateImagePathsFromDBRows(rows) {
    let paths = []
    for (let i = 0; i < rows.length; i++) {
        let obj = {
            "path": rows[i].path.slice(7),
            "caption": rows[i].caption,
            "timestamp": rows[i].timestamp,
            "id": rows[i].id,
            "pfpPath": rows[i].pfpPath,
        }
        if (Object.keys(rows[i]).includes("username")) {
            obj["username"] = rows[i].username
        }
        paths.push(obj)
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

router.route('/pfpUpload').post(authenticateToken, async (req, res) => {
    const username = req.body.userId.userId
    upload(req, res, (err) => { //initiates the storage function for the photo
        if (err) {
            console.log(`/upload ERROR: ${err}`);
            res.sendStatus(500)
        }
        // console.log("/pfpUpload req body", JSON.parse(req.body.body))
        const filePath = req.file.path

        db.run(`UPDATE Users SET pfpPath = '${filePath}' WHERE username = '${username}'`, async (err) => {
            if (err) {
                console.log(`/upload ERROR: ${err}`);
                res.status(500).send({ "message": "Database error!", "success": false })
                return
            }
            res.send(req.file)
        })
    })
})

router.route('/savePhoto').post(authenticateToken, async (req, res) => {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const filePath = `public/${uuidv4()}.png`
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) throw err
        else {
            const username = req.body.userId.userId
            const caption = ""
            const timestamp = getDateTimeForDB()

            db.get(`SELECT id FROM Users WHERE username = '${username}'`, async (err, row) => {
                if (err) {
                    console.log(`/upload ERROR: ${err}`);
                    res.status(500).send({ "message": "Database error!", "success": false })
                    return
                }
                const userId = row.id
                db.run(`INSERT INTO Images (path, timestamp, userId, caption, challengeId) VALUES ('${filePath}', '${timestamp}', ${userId}, '${caption}', ${req.body.challengeId})`)
            })
        }
    })
    res.status(200).send({})

})

router.route('/i/:challengeId').get(authenticateToken, async (req, res) => {
    if (isNaN(req.params.challengeId)) {
        res.sendStatus(500)
        return
    }
    db.get(`SELECT i.path, i.timestamp, i.caption, i.id, u.username, u.pfpPath 
        FROM Images i
        JOIN Users u ON i.userId = u.id
        WHERE i.id = ${Number(req.params.challengeId)};`,
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
                let userId = row.id
                db.all(`
                        SELECT i.path, i.timestamp, i.caption, i.id, i.userId, u.username, u.pfpPath FROM Images i 
                        INNER JOIN Associations a
                        ON a.targetUserId = i.userId
                        INNER JOIN Users u
                        ON a.targetUserId = u.id
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

router.route('/userFeed').post(authenticateToken, async (req, res) => {
    //priority query for current friends or former associates
    db.all(`SELECT u.id, u.username, u.pfpPath, a.type FROM Associations a
            INNER JOIN Users u
            ON u.id = a.targetUserId
            WHERE a.userId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)}
            AND u.username LIKE '%${req.body.query}%';`, async (err, row) => {
        if (err) {
            console.log(`/userFeed associate query ERROR: ${err}`);
            res.status(500).send({ 'message': 'Database error!', 'success': false });
        }
        else {
            let matches = row
            let exclusionString = matches.map((m) => m.id).join(',')

            //query to get all user's matching
            db.all(`SELECT id, username, pfpPath FROM Users
                    WHERE username LIKE '%${req.body.query}%' AND id NOT IN (${exclusionString});`,
                async (err, row) => {
                    if (err) {
                        console.log(`/userFeed non-associate query ERROR: ${err}`);
                        res.status(500).send({ 'message': 'Database error!', 'success': false });
                    }
                    else {
                        let newMatches = row.map((elem) => ({ ...elem, type: -1 }))
                        matches = [...matches, ...newMatches]
                        res.status(200).send({ matches: matches });
                    }
                })
        }
    })



})

router.route('/friendsFeed').post(authenticateToken, async (req, res) => {
    const viewedProfile = req.body.user ? req.body.user : req.body.userId.userId
    //priority query for current friends or former associates
    // u1 = logged in
    // u2 = viewed profile
    db.all(`SELECT u.id, u.username, u.pfpPath 
            FROM Users u
            INNER JOIN Associations a
            ON u.id = a.targetUserId
            WHERE a.userId = ${getSQLStringUserIdFromUsername(viewedProfile)}
                AND u.username LIKE '%${req.body.query}%'
                AND a.type = 1;`, async (err, row) => {
        if (err) {
            console.log(`/userFeed associate query ERROR: ${err}`);
            res.status(500).send({ 'message': 'Database error!', 'success': false });
        }
        else {
            console.log(row);
            let viewedProfileFriends = row;
            db.all(`SELECT u.id, u.username, u.pfpPath, a.type
                FROM Associations a
                INNER JOIN Users u
                ON u.id = a.targetUserId
                WHERE a.userId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)};`, async (err, row) => {
                if (err) {
                    console.log(`/userFeed associate query ERROR: ${err}`);
                    res.status(500).send({ 'message': 'Database error!', 'success': false });
                }
                else {
                    let finalResult = [];
                    viewedProfileFriends.forEach((f) => {
                        let found = false;
                        if (f.username === req.body.userId.userId) {
                            let temp = f;
                            temp.type = -2;
                            finalResult.push(temp);
                            return;
                        }
                        row.forEach((u1) => {
                            if (u1.id == f.id) {
                                finalResult.push(u1);
                                found = true;
                            }
                        });
                        if (found === false) {
                            let temp = f;
                            temp.type = -1;
                            finalResult.push(temp);
                        }
                    });
                    res.status(200).send({ matches: finalResult });
                }
            })
        }
    })
})

function getSQLStringUserIdFromUsername(username) {
    return `(SELECT id FROM Users WHERE username = '${username}')`
}

router.route('/associationRequest').post(authenticateToken, async (req, res) => {
    let newFriends = req.body.currentCode

    if (req.body.currentCode == 0 && req.body.code == -1) { //cancel friend request
        db.run(`DELETE FROM Associations
                WHERE userId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)} 
                AND targetUserId = ${getSQLStringUserIdFromUsername(req.body.pageUserName)};`,
            async (err) => {
                newFriends = -1
                res.status(200).send({ "message": "updated association", "friends": newFriends })
            })
    }
    if (req.body.currentCode == -1 && req.body.code == 0) { //no existing friendship but a request is made
        //first check if the target has a pending request on you
        db.get(`
            SELECT type FROM Associations WHERE userId = ${getSQLStringUserIdFromUsername(req.body.pageUserName)}
            AND targetUserId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)};
        `, async (err, row) => {
            if (err) {
                console.log(`/associationRequest ERROR: ${err}`);
                res.status(500).send({ 'message': 'Database error!', 'success': false });
            }
            else {
                if (row === undefined) {
                    //no prior request so we make a pending friendship
                    db.run(`INSERT INTO Associations (timestamp, targetUserId, userId, type)
                            VALUES ('2024-71-18 13:43:18', ${getSQLStringUserIdFromUsername(req.body.pageUserName)}, ${getSQLStringUserIdFromUsername(req.body.userId.userId)}, 0);`)
                    newFriends = 0
                }
                else if (row.type == 0) {
                    db.run(`INSERT INTO Associations (timestamp, targetUserId, userId, type)
                            VALUES ('2024-71-18 13:43:18', ${getSQLStringUserIdFromUsername(req.body.pageUserName)}, ${getSQLStringUserIdFromUsername(req.body.userId.userId)}, 1);`)
                    db.run(`UPDATE Associations SET type = 1
                            WHERE userId = ${getSQLStringUserIdFromUsername(req.body.pageUserName)} AND targetUserId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)};`)
                    newFriends = 1
                }
                res.status(200).send({ "message": "updated association", "friends": newFriends })
                return
            }
        })
    }
    if (req.body.currentCode == 1) { //remove existing friendship
        db.run(`DELETE FROM Associations
                WHERE userId = ${getSQLStringUserIdFromUsername(req.body.pageUserName)} 
                AND targetUserId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)};`)
        db.run(`DELETE FROM Associations
                WHERE userId = ${getSQLStringUserIdFromUsername(req.body.userId.userId)} 
                AND targetUserId = ${getSQLStringUserIdFromUsername(req.body.pageUserName)};`,
            async (err) => {
                newFriends = -1
                res.status(200).send({ "message": "updated association", "friends": newFriends })
            })
    }
})

router.route('/whoami').get(authenticateToken, async (req, res) => {
    res.status(200).send({ "username": req.body.userId.userId })
})

//SELECT * FROM Challenges WHERE start = '2024-10-4 00:00:00';
router.route('/challenge').get(authenticateToken, async (req, res) => {
    db.get(`SELECT * FROM Challenges WHERE active = 1;`, async (err, row) => {
        if (err) {
            console.log(`/challenge ERROR: ${err}`);
            res.status(500).send({ 'message': 'Database error!', 'success': false });
        }
        else {
            res.status(200).send(row)
        }
    }
    )
})

router.route('/newChallenge').get(authenticateToken, async (req, res) => {
    db.run(`UPDATE Challenges SET active = 0;`, async (err) => {
        //select new challenge for today
        db.all('SELECT id FROM Challenges where picked = 0;', async (err, row) => {
            if (err) {
                console.log("ERROR: Selecting unpicked challenges", err)
                res.status(500).send({ "error": err })
            }
            else {
                if (row.length == 0) {
                    db.run(`UPDATE Challenges SET picked = 0;`)
                    db.all('SELECT id FROM Challenges where picked = 0;', async (err, row) => {
                        if (err) {
                            console.log("ERROR: Selecting unpicked challenges", err)
                        }
                        else {
                            const newActiveChallengeId = row[Math.floor(Math.random() * row.length)]["id"]
                            db.run(`UPDATE Challenges SET picked = 1, active = 1 WHERE id = ${newActiveChallengeId}`, async (err) => {
                                if (err) {
                                    console.log("ERROR: Selecting unpicked challenges", err)
                                    res.status(500).send({ "error": err })
                                }
                                else {
                                    console.log("/newChallenge new challenge picked ", newActiveChallengeId)
                                    res.status(200).send({})
                                }
                            })
                        }
                    })
                }
                else {
                    const newActiveChallengeId = row[Math.floor(Math.random() * row.length)]["id"]
                    console.log("New Active Challenge Id ", newActiveChallengeId)
                    db.run(`UPDATE Challenges SET picked = 1, active = 1 WHERE id = ${newActiveChallengeId}`, async (err) => {
                        if (err) {
                            console.log("ERROR: Selecting unpicked challenges", err)
                            res.status(500).send({ "error": err })
                        }
                        else {
                            console.log("/newChallenge new challenge picked ", newActiveChallengeId)
                            res.status(200).send({})
                        }
                    })
                }
            }
        })
    })
});

router.route('/updateProfile').post(authenticateToken, async (req, res) => {
    db.run(`UPDATE Users SET bio = '${req.body.bio}' WHERE username = '${req.body.userId.userId}';`)
    res.status(200).send({})
});

app.use(express.static('public'));


app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})