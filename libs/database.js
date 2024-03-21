import { Sequelize } from "sequelize";

// const sequelize = new Sequelize(`${process.env.DATABASE_URL}`)

const sequelize = new Sequelize('tavia', 'root', 'Mysqls1234', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize