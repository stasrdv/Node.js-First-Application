const express = require("express");
const router = express.Router();

// POST create new Account
router.get("/home", (req, res) => {
  return res.status(200).json(posts);
});

module.exports = router;

const posts = [
  {
    title: "Chat based on Socket.io",
    icon: "chat",
    body: `In WebSockets, the server can send data to the client, but the client
    can too ! A WebSocket is a kind of communication pipe opened in two
    directions. Socket.io is a library based on this protocol to make the
    use of WebSockets easier.`
  },
  {
    title: "JWT",
    icon: "jwt",
    body: `JSON Web Token (JWT) is an open standard (RFC 7519) that defines a
    compact and self-contained way for securely transmitting information
    between parties as a JSON object. This information can be verified and
    trusted because it is digitally signed. JWTs can be signed using a
    secret (with the HMAC algorithm) or a public/private key pair using RSA
    or ECDSA.`
  },
  {
    title: `Core and lazy-loaded Feature modules`,
    icon: `lazy`,
    body: `      The documentation suggests to do a CoreModule for global services.
    All services which have to have one and only one instance per
    application (singleton services) should be implemented here. Typical
    example can be authentication service or user service.
  Every other feature module should be loaded lazily
    after user triggered navigation.`
  },
  {
    title: "Cacheable",
    icon: "cache",
    body: `   Improve your Angular app performance by using this simple Observable
    cache decorator (ngx-cacheable). Observable cache decorator you can use
    to decorate class methods which return streams and cache their return
    values.`
  },
  {
    title: "Aliases for app and environments",
    icon: "alias",
    body: `        Aliasing our app and environments folders will enable us to implement
    clean imports which will be consistent throughout our application.`
  },
  {
    title: "Using Sass and Angular Material",
    icon: "sass",
    body: `  Sass is also required to effectively use official Angular Material
    Components library with it’s extensive theming capabilities. It is safe
    to assume that using Sass it’s the default choice for most projects.`
  }
];
