module.exports = [{
    name: "default",
    type: 'postgres',
    url: process.env.DB_URL,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    logging: false, // ?
    migrations: [
        "src/migrations/**/*.ts"
    ],
    cli: {
        migrationsDir: "src/migrations"
    }
}, {
    name: "test",
    type: "postgres",
    url: "postgres://localhost:5432/bookify_test", // TODO: use env variable?
    dropSchema: true,
    migrationsRun: true,
    synchronize: false,
    logging: false,
    migrations: [
        "src/migrations/**/*.ts"
    ],
    cli: {
        migrationsDir: "src/migrations"
    }
}];