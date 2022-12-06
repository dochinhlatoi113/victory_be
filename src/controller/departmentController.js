const db = require("../models/index")

let show = async (req, res) => {   
   try {
    let lists =  await db.departments.findAll();
    let data = {
        lists: lists,
        message:req.flash('message')
    }
    res.render("../views/group/department/show.handlebars", data)
   } catch (error) {
      error
   }
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

let edit =async (req,res) => {
    let id = req.params.id
    const checkDepartment = await db.departments.findOne({ where: { id: id } });
   
    if(checkDepartment){
        let data = {
            id : id,
            checkDepartment:checkDepartment,
            message:req.flash('message')
        }
        res.render("../views/group/department/edit.handlebars",data)
    }else{
        res.render("../views/error/error.handlebars",{layout: null})
    }
}
let update = async(req,res) => {
    let id = req.params.id
 
    try {
       await db.departments.update(
                { name: req.body.name },
                { where: { id: id } }
            )
            req.flash('message', 'updated successfully');
            res.redirect("/group/department/edit/"+id)
      }catch (err) {
        res.send(err);
      }
}
let destroy = async(req, res) => {
    let id = req.params.id
    try {
        await db.departments.destroy(
        
            { where: { id: id } }
        )
            req.flash('message', 'delete successfully');
            res.redirect("/group/department")
      }catch (err) {
        res.send(err);
      }
}

module.exports = {
    show,create, store, edit,update,destroy
}
       