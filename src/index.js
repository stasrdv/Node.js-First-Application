let express = require("express");
let app = express();
let path = require("path");

let personRoute = require("./routes/person");

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toString()} =>  ${req.originalUrl}`);
  next();
});

app.use(personRoute);
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
