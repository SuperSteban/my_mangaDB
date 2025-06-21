import dotenv from 'dotenv';

import pgPromise from 'pg-promise';

dotenv.config();



const pgp = pgPromise({
  capSQL: true,
  error(err, e) {
    console.error('DB Error:', {
      query: e.query,
      params: e.params,
      error: err
    });
  },
});
const cn = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as any),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: parseInt(process.env.MAX_POOL_CON as any),
  idleTimeoutMillis: parseInt(process.env.IDLE_TIMOUT_MILLI as string),

};

const db = pgp(cn)
process.on('SIGINT', () => {
  console.log('Closing DB pool...');
  pgp.end();
  process.exit();
});
export default db;
