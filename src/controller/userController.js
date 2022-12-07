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
            where: { name: { [Op.like]: `%${keyWord}%`} },
        })
        let lists =  await db.Admin.findAll({
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
            message:req.flash('message')
        }
        res.render("../views/group/user/show.handlebars", data)
    }
  
   } catch (error) {
      error
   }
}
let create = (req,res) => {
    res.render("../views/group/user/create.handlebars",{message:req.flash('message')})
}
let store =async(req, res) => {
    try {
       
        const department = await db.Admin.create({
            email:req.body.email,
            firstName : req.body.firstName,
            lastName :req.body.lastName,
            password:req.body.password
        });
        req.flash('message', 'saved successfully');
        res.redirect("/group/user/create")
      }catch (err) {
        res.send(err);
      }
}

// let edit =async (req,res) => {
//     let id = req.params.id
//     const checkDepartment = await db.Admin.findOne({ where: { id: id } });
   
//     if(checkDepartment){
//         let data = {
//             id : id,
//             checkDepartment:checkDepartment,
//             message:req.flash('message')
//         }
//         res.render("../views/group/department/edit.handlebars",data)
//     }else{
//         res.render("../views/error/error.handlebars",{layout: null})
//     }
// }
// let update = async(req,res) => {
//     let id = req.params.id
 
//     try {
//        await db.Admin.update(
//                 { name: req.body.name },
//                 { where: { id: id } }
//             )
//             req.flash('message', 'updated successfully');
//             res.redirect("/group/department/edit/"+id)
//       }catch (err) {
//         res.send(err);
//       }
// }
let destroy = async(req, res) => {
    let id = req.params.id
    console.log("aa",id)
    try {
        await db.Admin.destroy(
            { where: { id: id } }
        )
            req.flash('message', 'delete successfully');
            res.redirect("/group/user/")
      }catch (err) {
        res.send(err);
      }
}


module.exports = {
    show,create, store ,destroy
}
       