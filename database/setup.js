const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function setupDB(){
  const client = await pool.connect();
  try{
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema);
    console.log('Database Schema created successfully!')
  }catch(e){
    console.error('Database setup failed: ', e);
  }finally{
    client.release();
    pool.end();
  }
}

setupDB();
