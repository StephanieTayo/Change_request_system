const express = require('express');
var path = require("path");
let app = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Project = require("../models/project");
const Request = require("../models/request");


app.get("/", async(req, res, next) => {
      

      
      const listProduct = await Project.find(); 
      res.render('index',{products : listProduct });
   
})

app.get("/index", (req, res, next) => {
  res.sendFile(path.join(__dirname,"../views","index.html"));   

  


}) 

// Product aspects 
app.get("/listproduct", async(req, res, next) => {
  const listProject  =  await Project.find();
  res.render('listproducts',{projects:listProject});
})

app.post("/saveproduct",  (req, res) => {

  let title = req.body.title ; 
  let descriptioon = req.body.descriptioon ;
  var myData = new Project({title,descriptioon }); 
  console.log(descriptioon);
  myData.save()
  .then(item => {
  res.send({info:"Ok"});
  })
  .catch(err => {
    res.send({info:" not Ok"});;
  });
 });
 


 app.post("/saveRequest",  (req, res) => {

  let projectid = req.body.projectid ;  
  let name = req.body.name ; 
  let address = req.body.address ; 
  let email = req.body.email ; 
  
  var myData = new Request({projectid,name,address,email }); 
  console.log(myData);
  myData.save()
  .then(item => {
  res.send({info:"Ok"});
  })
  .catch(err => {
    res.send({info:" not Ok"});;
  });
 });
 

// app.get("/listuser", (req, res, next) => {
//   res.sendFile(path.join(__dirname,"../views","listuser.html")); 
// }) 

app.get("/listcustomers", (req, res, next) => {
  res.sendFile(path.join(__dirname,"../views","listcustomers.html")); 
}) 







app.get("/admin", async (req, res, next) => {
  if(req.cookies.user_name != null && req.cookies.isLoggedIn =="true"){
    const users =  await User.find();
      res.render("dashboard",{data:users});
  }else {
      res.redirect("/login");
  }
})
  
  app.get("/signup", function (req, res, next) {
    res.render('signup');
  });
  
  app.get("/login", function (req, res, next) {
    res.render('login');
  });
  
  
  
  app.post("/login", async (req, res) => {
    
    const { username, password } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ username : username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const response = await bcrypt.compare(password, user.password);
    // Check if password is correct
    if (!response) {
         return res.status(400).json({ message: "Invalid credentials" });
    }
  
    // If user exists and password is correct, set cookies and redirect to dashboard
    res.cookie('isLoggedIn', true);
    res.cookie('user_name', user.username);
    res.redirect('/getcreatechangerequest');
  });
  
  
  app.get('/logout', function(req, res) {
      req.logout(function(err) {
        if (err) {
          return next(err);
        }
        res.cookie('user_name', null);
    res.cookie('isLoggedIn', false);
        // Redirect to the home page or any other page after logout
        res.redirect('/login');
      })
      
    });
    
  
  
  app.post("/signup", (req, res) => {
    const { fullname, 
      username,
      email,
      address,
      password} = req.body;
    
    
    User.findOne({ username: username }).then((user) => {
      if (user) {
        req.flash("error_msg", "User already taken.");
        res.redirect("/signup");
      } else {
        const newUser = new User({      
          fullname, 
          username,
          email,
          address,
          password   
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in."
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });
  

  app.post("/addrequest", (req, res) => {
    const { projectId, desc , name, email} = req.body;  
    const newRequest = new Request({
      projectId,
      desc,
      name,
      email  
    });
    newRequest.save()
    .then((data) => {
      req.flash(
        "success_msg",
        "Request registered."
      );
      res.redirect("back");
    })
    .catch((err) => console.log(err));
   
  });

  app.post("/addproject", (req, res) => {
    const {  name, desc} = req.body;  
    const newProject = new Project({
      name,
      desc  
    });
    newProject.save()
    .then((data) => {
      req.flash(
        "success_msg",
        "Project registered."
      );
      res.redirect("back");
    })
    .catch((err) => console.log(err));
   
  });


  app.get("/getprojects", async (req, res) => {
    const projects =  await Project.find(); 
     
     res.send(projects);
  });

  app.post("/listuser", async (req, res) => {
    const users =  await User.find(); 
     
    //  res.render(,{data:users});
  });

  app.post("/getrequests", async (req, res) => {
    const requests = await Request.find(); 
    res.send(requests);
 });

 app.get("/getcreatechangerequest", async (req , res )=>{
  
     
      const listRequests = await Request.find(); 
      res.render('createRequest',{requests : listRequests });

    
 })


 app.get("/listuser", async (req, res, next) => {
  if(req.cookies.user_name != null && req.cookies.isLoggedIn =="true"){
    const users =  await User.find();
      res.render('listuser',{data:users});
  }else {
      res.redirect("/login");
  }

})


app.get("/error", (req, res, next) => {
    res.status(401).sendFile(path.join(__dirname, "../html", "error.html"))
})

// app.use((err,req, res, next) => {
//     res.redirect("/");
// })

app.use((req, res, next) => {
    res.status(404).send("404, resource not found")
})

module.exports = app;
