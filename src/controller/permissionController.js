const db = require("../models/index")
let show = async (req, res) => {
    try {
        let listPermission = await db.permissions.findAll();  
        let data = {
            listPermission
        }   
        res.render("../views/group/permission/show.handlebars",data)
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    show
}
       