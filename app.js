const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { match } = require("assert");
const { render } = require("ejs");
const secret = require("./secret");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
var matchotp = 0;

app.get("/", (req, res) =>{
    res.render("index");
});

app.get("/otp", (req, res) =>{
    res.render("otp")
});

app.get("/verified", (req, res) =>{
    res.render("authenticate", {
        remark: "Otp verified"
    })
})

app.get("/failed", (req, res) =>{
    res.render("authenticate", {
        remark: "Otp verification failed"
    })
})

app.post("/", (req, res)=>{
    otp = getRandomInt(100000,1000000);
    matchotp = otp;
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: secret.email,
            pass: secret.password
        }
    });
    
    var mailOptions = {
        from: secret.email,
        to: req.body.email,
        subject: "OTP on contact form",
        html: `<h1>Hello ${req.body.fname}</h1><p>OTP for your registration is</p><h2>${otp}</h2>`
    }

    transporter.sendMail(mailOptions, (err, info) =>{
        if (err) {
            console.log(err);
        } else {
            console.log(`Email sent: `+info.response);
            res.redirect("/otp");
        }
    })
});

app.post("/otp", (req, res) =>{
    if (req.body.otp == matchotp) {
        res.redirect("/verified")
    } else {
        res.redirect("/failed");
    }
})






app.listen(7000, ()=>{
    console.log("Listnening to port 7000");
})