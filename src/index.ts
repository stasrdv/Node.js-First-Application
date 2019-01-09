const server = require("express");

const app = express();

const path = require("path");

const bodyParser = require("body-parser");

// Routes
const registerRoute = require("./routes/register");

// body-parser
app.use(bodyParser.json());
// apply route tp app
app.use(registerRoute);

app.use(server.static("public"));

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
