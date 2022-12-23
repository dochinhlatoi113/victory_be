const db = require("../models/index")
const { Op } = require("sequelize");
let show = async (req, res) => {   
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    let offset = (page-1) * itemPerPage
   try {
    if(keyWord != undefined) {
        let totalItems = await db.programs.count({
            where: { name: { [Op.like]: `%${keyWord}%`} },
        })
        let lists =  await db.programs.findAll({
            where: { name: { [Op.like]: `%${keyWord}%`} },
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
        res.render("../views/category_program/show.handlebars", data)
    }else{
        let totalItems = await db.programs.count({
          
        })
        let lists =  await db.programs.findAll({
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
            message:req.flash('message'),
           
        }
        res.render("../views/category_program/show.handlebars", data)
    }
  
   } catch (error) {
      error
   }
}
let create = (req,res) => {
    let data = {
        messageErr: req.flash('messageErr'),   
        message:req.flash('message')
    }
    res.render("../views/category_program/create.handlebars",{data})
}
let store =async(req, res) => {
    try {
        let lists = await db.programs.findOne({where:{ code:req.body.code , name: req.body.name}})
        if(lists) {
            req.flash('messageErr', 'đã tồn tại chương trình này rồi');
            return  res.redirect("/category_program/create")
        }
        await db.programs.create({ code:req.body.code ,country:req.body.country,name:req.body.name, status:req.body.status ? req.body.status : 0});
        req.flash('message', 'saved successfully');
        res.redirect("/category_program/")
      }catch (err) {
        res.send(err);
      }
}

let edit =async (req,res) => {
    let id = req.params.id
    const checkDepartment = await db.programs.findOne({ where: { id: id } });
   
    if(checkDepartment){
        let data = {
            id : id,
            checkDepartment:checkDepartment,
            message:req.flash('message')
        }
        res.render("../views/category_program/edit.handlebars",data)
    }else{
        res.render("../views/error/error.handlebars",{layout: null})
    }
}
let update = async(req,res) => {
    let id = req.params.id
 
    try {
       await db.programs.update(
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
       