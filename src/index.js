let express = require("express");

let app = express();

let path = require("path");

let bodyParser = require("body-parser");

// Routes
let personRoute = require("./routes/person");
let customerRoute = require("./routes/customer");

// body-parser
app.use(bodyParser.json());

// Middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toString()} =>  ${req.originalUrl}`, req.body);
//   next();
// });

app.use(personRoute);
app.use(customerRoute);
app.use(express.static("public"));

// Handler for 404 - Not found
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
// Handler for Error 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendFile(path.join(__dirname, "../public/500.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
