const db = require("../../models/index")

let checkPermssion = async (req, res) => {
    console.log(req.user)
    let data = {
        department:req.user.departments
    }
    if(req.user.departments =='phòng thụ lý' ){
        console.log("aa",req.user.departments)
        // res.render("../views/recivingRoom/index.handlebars", data)
      res.redirect("/reciving-room/")
    
    }
    if(req.user.departments =='phòng giám đốc'){
        console.log("aasssss",req.user.departments)
        // res.render("../views/group/user-permission/show.handlebars", data)
        
         return res.redirect("/group/user-permission/" )
 
    }
}

module.exports = {
    checkPermssion
}
   