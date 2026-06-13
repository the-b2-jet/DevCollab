const pool = require('../config/db')

async function testDBConnection(){
  try{
    const {rows} = await pool.query('SELECT NOW()');
    console.log('Database connected: ', rows[0]);
    process.exit(0);
  }catch (e){
    console.error('Database connection failed: ', e);
    process.exit(1);
  }
};

testDBConnection();
