try {
  require('dotenv').load();
} catch (error) {
  console.error(error);
}
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/chat_app'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
