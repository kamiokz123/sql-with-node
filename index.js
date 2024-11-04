const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));



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

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (error) {
    res.send("something wrong");
    console.log(error);
  }
});

app.get("/users", (req, res) => {
  let q = "SELECT id,username,email FROM user";
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      let data = result;
      console.log(data[0]);
      res.render("users.ejs", { data });
    });
  } catch (error) {
    res.send("something wrong");
    console.log(error);
  }
});


app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id="${id}"`;
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("edit.ejs", { user })
    });
  } catch (error) {
    res.send("something wrong");
    console.log(error);
  }
});

app.patch("/users/:id/update", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  console.log(formPass, newUsername);

  let q = `SELECT * FROM user WHERE id="${id}"`;
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("wrong password")
      } else {
        let q2 = `UPDATE user SET username="${newUsername}" WHERE id="${user.id}"`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.redirect("/users");
        })
      }
    });
  } catch (error) {
    res.send("something wrong in database");
    console.log(error);
  }
});


app.get("/add", (req, res) => {
  res.render("add.ejs")
});

app.post("/add", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  console.log(username, email, password, id);

  let q = `INSERT INTO user (id, username, password, email) VALUES ("${id}","${username}", "${password}", "${email}")`;
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.redirect("/users")
    });
  } catch (error) {
    res.send("something wrong in database");
    console.log(error);
  }
});


app.delete("/users/:id/delete",(req,res)=>{
  let {id} = req.params;
  console.log(id);
  let q = `DELETE FROM user WHERE id = "${id}"`;
  try {
    connection.query(q, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.redirect("/users")
    });
  } catch (error) {
    res.send("something wrong in database");
    console.log(error);
  }  
});

app.listen(8080, () => {
  console.log("app is listening");
})


// try {
//   connection.query(q, [data], function (err, results, fields) {
//     if (err) throw err;
//     console.log("res :", results);
//   });
// } catch (error) {
//   console.log(error);
// }

// connection.end();




