let expres = require("express");

let app = expres();

let path = require("path");

let bodyParser = require("body-parser");

// Routes
let registerRoute = require("./routes/register");
let loginRoute = require("./routes/log-in");

// body-parser
app.use(bodyParser.json());
// apply route tp app
app.use(registerRoute, loginRoute);

app.use(expres.static("public"));

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
