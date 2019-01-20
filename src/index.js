let expres = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
const expressJwt = require("express-jwt");

// Routes
let registerRoute = require("./routes/register");
let loginRoute = require("./routes/auth");
let getItems = require("./routes/items");
// let verify = require("./routes/verify");

let app = expres();

// cors
app.use(cors());

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expres.static("public"));

app.all("*", (req, res) => {
  res.redirect("/");
});

app.use(
  expressJwt({ secret: "i31GOVwz5K0W" }).unless({
    path: ["/auth", "/register"]
  })
);
// Apply routes
app.use(loginRoute, registerRoute, getItems);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
