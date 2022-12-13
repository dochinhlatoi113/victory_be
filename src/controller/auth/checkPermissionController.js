const db = require("../../models/index")

let checkPermssion = async (req, res) => {
    if(req.user.departmentsId == 1 ){
        // res.render("../views/recivingRoom/index.handlebars", data)
      res.redirect("/reciving-room/")
    }
    if(req.user.departmentsId == 0){
        // res.render("../views/group/user-permission/show.handlebars", data)
         return res.redirect("/group/user-permission/" )
 
    }
}

module.exports = {
    checkPermssion
}
   