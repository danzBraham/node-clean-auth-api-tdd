/* istanbul ignore file */
const bcrypt = require('bcrypt');
const pool = require('../src/Infrastructures/database/postgres/pool');
const BcryptPasswordHash = require('../src/Infrastructures/security/BcryptPasswordHash');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'danzbraham',
    password = 'secret',
    fullname = 'Zidan Abraham',
  }) {
    const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
    const hashedPassword = await bcryptPasswordHash.hash(password);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, hashedPassword, fullname],
    };

    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  },
};

module.exports = UsersTableTestHelper;
