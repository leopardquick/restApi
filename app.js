const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const _ = require("lodash")
const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs")


//for database

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = new mongoose.model("Article", articleSchema)



app.get("/", (req, res) => {
  res.render("test")
})


// restfull api

app.route("/articles")
  .get((req, res) => {
    Article.find((err, article) => {
      if (err) {
        console.log(err);
      } else {
        res.send(article)
      }
    })
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(err => {
      if (!err) {
        res.send("sucessfullly added new article")
      } else {
        res.send(err)
      }
    })

  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("sucessfullly delete all")
      } else {
        res.send(err)
      }
    })
  })

// for specific article
app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (err, article) => {
      if (article) {
        res.send(article)
      } else {
        res.send("no article found")
      }
    })
  })
  .put((req, res) => {
    Article.update({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    },{
      overwrite : true
    },err=>{
      if(!err){
        res.send("sucessfullly updated")
      }else{
        res.send("not updated")
      }
    }
  )
  })
  .patch((req, res) => {
    Article.update({
      title: req.params.articleTitle
    }, {
      $set : req.body
    },err=>{
      if(!err){
        res.send("sucessfullly updated")
      }else{
        res.send("not updated")
      }
    }
  )
  })
  .delete((req, res) => {
    Article.deleteOne({title:req.params.articleTitle},(err) => {
      if (!err) {
        res.send("sucessfullly delete all")
      } else {
        res.send(err)
      }
    })
  })




app.listen(process.env.PORT || 3000, () => {
  console.log("listening at port 3000")
})
