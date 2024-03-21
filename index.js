import express from "express";
import 'dotenv/config'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import router from "./routes/index.js"
import sequelize from "./libs/database.js";


const app = express()
const port = 8000

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(router)

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



