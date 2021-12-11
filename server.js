const cors = require("cors");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const express = require("express");
const flash = require("connect-flash");

const userInViews = require("./lib/middleware/userInViews");
const {
	authRouter,
	homeRouter,
	usersRouter,
	createFormRouter,
	dashboardRouter,
	formRouter,
} = require("./routes");

// connect mongoDB
require("./lib/db")();

// configure passport
require("./lib/passportcfg");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

// configure view engine
const hbs = exphbs.create({
	extname: ".hbs",
	helpers: {
		renderForm: function ({ id, form }) {
			let html = "";
			html += form;
			html += `<input type="hidden" name="id" value="${id}">`;
			return html;
		},
		renderDashboard: function (forms) {
			let html = "";
			forms.forEach((form) => {
				html += `<a href="/createForm/${form.id}" id="userForm-item--container-0" class="userForm-item--container outer-shadow">
				<div class="userForm-item--img">
					<img src="/asset/img/dashboard/User-form-img.svg" alt="Form image">
				</div>
				<div class="userForm-item--deatails">
					<input type="text" value="${form.name}" disabled>
					<div class="userForm-item--nav">
						<span>EZ form</span>
						<button id="userForm-item--remove-0" class="userForm-item--remove fas fa-trash-alt"></button>
					</div>
				</div>
				<input type="hidden" value="${form.id}">
			</a>`;
			});
			return html;
		},
	},
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// configure session
const sess = {
	secret: "secret",
	cookie: { expires: false },
	resave: false,
	saveUninitialized: true,
};

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// every request will have to pass here
// app.use(userInViews());
app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/", usersRouter);
app.use("/", createFormRouter);
app.use("/", dashboardRouter);
app.use("/", formRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});