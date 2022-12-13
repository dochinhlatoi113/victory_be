const db = require("../models/index")
let show = async (req, res) => {   
    const lists = await db.departments.findAll();
    const data = {
        lists:lists
    }
    res.render("../views/group/department/show.handlebars",{data})
}
let create = (req,res) => {
    res.render("../views/recivingRoom/create.handlebars")
}
module.exports = {
    show,create
}
       