const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'testing',
  password: "kami123"
});

const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
}

// let q = "INSERT INTO USER (id,username,email,password) VALUES (?,?,?,?)"; single per data
// let user = ["1","abc1","abc@gmail.com","abc"]; single per data

let q = "INSERT INTO USER (id,username,email,password) VALUES ?"; // double person or more data
let data = [];

for (let i = 1; i <= 100; i++) {
  data.push(getRandomUser());
}


try {
  connection.query(q, [data], function (err, results, fields) {
    if (err) throw err;
    console.log("res :", results);
  });
} catch (error) {
  console.log(error);
}

connection.end();




