// const flash = require("express-flash");
// const category = require("../models/category_film")


// let indexCategoryFilm =  (req, res) => {
//     category.find((err, category) => {
//         if (!err) {           
//             res.render("../views/category/index.handlebars",{category:category})
//         }         
//         else {
//             console.log('Error in retrieving users list :' + err);
//         }
//     });    
//    console.log(mess)
// }

// let createFormCategoryFilm =  (req, res) => {
//     res.render("../views/category/create.handlebars",{message:req.flash('message')})
// }

// let insertFormCategoryFilm = (req,res) => {

//         let insertCategory = new category({
//             name: req.body.name,        
//         })
//         insertCategory .save((err, doc) => {
//             if (!err){   
//                  req.flash("message","saved")    
//                 res.redirect('/create-category');
//             } else{

//             }
//       });
      
// }

// module.exports = {
//     createFormCategoryFilm, insertFormCategoryFilm,indexCategoryFilm
// }






// try {
    
//     let user = await db.Admin.findAll({
//         where: {
//             email: req.body.email,
//             password: req.body.password
//         },
//         raw: true,              
//     });       
//     for(let i = 0 ; i < user.length ; i ++ ){
//         if (req.body.email == user[i].email && req.body.password == user[i].password) {               
//             return done(null, {
//                 user,                     
//                 active: true
//             })
//         }           
//         // done(null, false)
//     }
    
// } 