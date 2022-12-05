const db = require("../models/index")

let show = async (req, res) => {   
    res.render("../views/group/department/show.handlebars")
}
let create = (req,res) => {
    res.render("../views/group/department/create.handlebars",{message:req.flash('message')})
}
let store =async(req, res) => {
    try {
        const department = await db.departments.create({ name:req.body.name});
        req.flash('message', 'saved successfully');
        res.redirect("/group/department/create")
      }catch (err) {
        res.send(err);
      }
}
module.exports = {
    show,create, store
}
       