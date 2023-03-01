module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    define:{
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
}