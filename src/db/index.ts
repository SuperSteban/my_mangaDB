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
/* const db = pgp({
  host: 'localhost',
  port: 5432,
  database: "manga_db",
  user: "blakymango",
  password: 'blakymango',
  max: 20,
  idleTimeoutMillis: 300000,

}); */
export default db;
