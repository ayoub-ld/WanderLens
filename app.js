import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import data from "./data.json" with {type: "json"} ;
import details from "./details.json" with {type: "json"};

const app = express();

// server config
app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    encodeURIComponent: function(str) {
      return encodeURIComponent(str);
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', './views');

// middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  const time = new Date().toLocaleTimeString();
  res.render("index", { time });
});

app.get("/list", (req, res) => {
  const destinations = data;
  res.render("list", { destinations });
});

app.get("/details/:name", (req, res) => {
  const destinationName = decodeURIComponent(req.params.name);
  const destination = details.find(d => d.name === destinationName);
  
  if (!destination) {
    return res.status(404).send("Destination not found");
  }
  
  res.render("details", { destination });
});

app.get("/contact", (req, res) => {
  res.status(200).render("contact");
});

app.post("/contact", (req, res) => {
  if (!req.body?.name || !req.body?.email || !req.body?.message) {
    return res.status(400).render("contact", { error: "All fields are required !" });
  }
  res.redirect("/response");
});

app.get("/response", (req, res) => {
  res.status(200).render("response");
});

// error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("An error has occured !");
});

// start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
