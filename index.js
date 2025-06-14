const express = require("express");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const user_controller = require("./controllers/user_controller.js");
const api_controller = require("./controllers/api_controller.js");
const { cookieCrypto } = require("./middlewares/cookieMiddleware.js");

const app = express();

app.engine(
    "hbs",
    handlebars.engine({
        // setup Handlebars view engine
        defaultLayout: "default",
        extname: ".hbs",
    })
);
app.set("view engine", "hbs"); // use Handlebars

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // for inbox page
app.use(express.json());
app.use(cookieParser());
app.use(cookieCrypto);

app.get("/", user_controller.loginPage);
app.get("/signup", user_controller.signupPage);
app.get("/inbox", user_controller.inbox);
app.get("/outbox", user_controller.outbox);
app.get("/compose", user_controller.compose);
app.get("/detail/:id", user_controller.detail);
app.get("/users", api_controller.getOtherUsers);

app.post("/", api_controller.login);
app.post("/signup", api_controller.signup);
app.post("/inbox", api_controller.getInbox);
app.post("/outbox", api_controller.getOutbox);
app.post("/email", api_controller.getEmailDetail);
app.post("/addEmail", api_controller.addEmail);
app.post("/deleteEmail", api_controller.deleteEmail);

app.listen(8000, "0.0.0.0", () => {
    console.log("Server is listening to port 8000...");
});
