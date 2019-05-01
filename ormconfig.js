const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: false,
    logging: false, // ?
    migrations: isProduction ? [ 'dist/src/migrations/**/*.js'] : [ "src/migrations/**/*.ts"],
    entities: isProduction ? ['dist/**/*Entity.js'] : ['src/**/*Entity.ts'],
    cli: {
        migrationsDir: "src/migrations"
    }
};