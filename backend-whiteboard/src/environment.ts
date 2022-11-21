export const environment = {
  db: {
    type: 'mongodb' as const,
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 27018,
    username: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'whiteboard',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '27365148',
    database: process.env.DB_NAME ? process.env.DB_NAME : 'whiteboard',
    entities: ['dist/**/*.entity{.ts,.js}'],
    // entities: ['src/**/*.entity{.ts,.js}'],
    authSource: process.env.DB_AUTHSOURCE ? process.env.DB_AUTHSOURCE : 'admin',
    synchronize: process.env.DB_SYNC ? process.env.DB_SYNC == 'YES' : true,
    logging: true,
  },
  JWT_ISSUER: 'credentials@whiteboard.tercerpiso.net',
  JWT_DURATION: process.env.JWT_DURATION
    ? parseInt(process.env.JWT_DURATION)
    : 2592000000,
  JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : '3-qG2AV88#L26',
};
