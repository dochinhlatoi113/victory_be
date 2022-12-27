const db = require("../models/index")
const { Op } = require("sequelize");
let show = async (req, res) => {   
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    
    let offset = (page-1) * itemPerPage
   try {
    if(keyWord != undefined) {
        let totalItems = await db.Admin.count({
            where: { email: { [Op.like]: `%${keyWord}%`} },
        })
        let lists =  await db.Admin.findAll({
            where: { email: { [Op.like]: `%${keyWord}%`} },
            limit: itemPerPage,
            offset:offset
        });
    
        let data = {
            lists: lists,
            currentPage: page,
            hasNextPage: (itemPerPage * page) < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            keyWord:keyWord,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemPerPage),
            message:req.flash('message')
        }
        res.render("../views/group/user/show.handlebars", data)
    }else{
        let totalItems = await db.Admin.count({
          
        })
        let lists =  await db.Admin.findAll({
            limit: itemPerPage,
            offset:offset
        });
        let data = {
            lists: lists,
            currentPage: page,
            hasNextPage: (itemPerPage * page) < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemPerPage),
          
        }
        res.render("../views/group/user/show.handlebars", data)
    }
  
   } catch (error) {
      error
   }
}
let create = (req,res) => {
    let data = {
        message:req.flash('message'),
        messageErr:req.flash('messageErr')
    }
    res.render("../views/group/user/create.handlebars",{data:data})
}
let store =async(req, res) => {
    
    try {
       let lists = await db.Admin.findOne({ where: { email: req.body.email } }) 
        if(lists){
            req.flash('messageErr', 'đã tồn tại account này');
            return  res.redirect("/group/user/create")
        }
        const user = await db.Admin.create({
             email:req.body.email, 
             password:req.body.password,
             firstName:req.body.firstName,
             lastName:req.body.lastName,
        });
        req.flash('message', 'saved successfully');
      return  res.redirect("/group/user/create")
      }catch (err) {
        res.send(err);
      }
}

let edit =async (req,res) => {
    let id = req.params.id
    const checkUser = await db.Admin.findOne({ where: { id: id } });
   
    if(checkUser){
        let data = {
            id : id,
            checkUser:checkUser,
            message:req.flash('message')
        }
        res.render("../views/group/user/edit.handlebars",data)
    }else{
        res.render("../views/error/error.handlebars",{layout: null})
    }
}
let update = async(req,res) => {
    let id = req.params.id
 
    try {
       await db.Admin.update(
                { name: req.body.name },
                { where: { id: id } }
            )
            req.flash('message', 'updated successfully');
            res.redirect("/group/user/edit/"+id)
      }catch (err) {
        res.send(err);
      }
}
let destroy = async(req, res) => {
    let id = req.params.id
   
    try {
        await db.Admin.destroy(
            { where: { id: id } }
        )
            req.flash('message', 'delete successfully');
            res.redirect("/group/user")

      }catch (err) {
        res.send(err);
      }
}


module.exports = {
    show,create, store, edit,update,destroy
}
       