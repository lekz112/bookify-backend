const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: false,
    logging: false, // ?
    migrations: isProduction ? [ 'dist/migrations/**/*.js'] : [ "src/migrations/**/*.ts"],
    cli: {
        migrationsDir: "src/migrations"
    }
};