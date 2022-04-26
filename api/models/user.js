const db = require('../dbConfig/init'); // required the db as the model is connect to the db
// requires db configurations as the model is connected to the db

class User { //specifies value wanted from specific key for the endpoint user 
    constructor(data){ // it wants data on the username,email and the salted and then hashed(encrypted) password
        this.username = data.username
        this.email = data.email
        this.passwordDigest = data.password_digest
    }
    
    static get all(){
        return new Promise(async (res, rej) => {// each time a user login's
            try {
                let result = await db.query(`SELECT * FROM users;`);// wait for request for specific data wanted from the pg db, in this case is all the data from the user table
                //this may take sometime so you ahve to wait + this code has to be completed before doing the other code
                let users = result.rows.map(r => new User(r))
                res(users)  //respond with requested data from db 
            } catch (err) { //catch any error 
                rej(`Error retrieving users: ${err}`) // reject error and response will error message which includes specific error
            }
        })
    }

    static create({ username, email, password }){ // create an username,email and password which represents each time a user registers 
        // a new username,email and password is created
        return new Promise(async (res, rej) => {
            try {// wait for the request of adding(insert) a new,email and encrypted password to to the pg db 
                let result = await db.query(`INSERT INTO users (username, email, password_digest)
                                                VALUES (${username}, ${email}, ${password}) RETURNING *;`);
                let user = new User(result.rows[0]);
                res(user)
            } catch (err) {
                rej(`Error creating user: ${err}`)
            }
        })
    }

    static findByEmail(email){ // resetting password using email address 
        return new Promise(async (res, rej) => {
            try {// wait to check if the email inputted for reset corresponds to any of the emails
                // in the email attribute in the user table in the pg db
                let result = await db.query(`SELECT * FROM users
                                                WHERE email = ${email};`);
                let user = new User(result.rows[0])
                res(user) // if it does response 
            } catch (err) { // catch errors
                rej(`Error retrieving user: ${err}`) // reject errors and send error message 
            }
        })
    }
}

module.exports = User // exported to controller 
