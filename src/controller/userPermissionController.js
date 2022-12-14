const db = require("../models/index")
const { QueryTypes,Op } = require("sequelize");
const checkArr = require("../helper/isset")
let show = async (req, res) => {   
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    
    let offset = (page-1) * itemPerPage
   try {
    if(keyWord != undefined) {
        let totalItems = await db.user_permission.count({
            include:[{
                model:db.departments
            },
            {
                model:db.permissions
            },
            {
                model:db.Admin
            }],
            where: {  '$Admin.email$': { [Op.like]: `%${keyWord}%`} },
        })
       
        let lists =  await db.user_permission.findAll({
           
            include:[{
                model:db.departments
            },
            {
                model:db.permissions
            },
            {
                model:db.Admin
            }],
            where: { '$Admin.email$': { [Op.like]: `%${keyWord}%`} },
            limit: itemPerPage,
            offset:offset,
            order: [['id', 'DESC']],
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
        res.render("../views/group/user-permission/show.handlebars", data)
    }else{
        let totalItems = await db.user_permission.count({
            
          
        })
        let lists =  await db.user_permission.findAll({
            include:[{
                model:db.departments
            },
            {
                model:db.permissions
            },
            {
                model:db.Admin
            }],
            limit: itemPerPage,
            offset:offset,
            order: [['id', 'DESC']],
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
        res.render("../views/group/user-permission/show.handlebars", data)
    }
  
   } catch (error) {
      error
   }
}
let create = async(req,res) => {
    let listsUserPermission =  await db.user_permission.findAll({
           
        include:[
        {
            model:db.Admin
        }],
        order: [['id', 'DESC']],
    });
  
    let listsUser =  await db.Admin.findAll({
        
    })
    
    let listsPermissions =  await db.permissions.findAll({
    
    })
    let listsDepartments =  await db.departments.findAll({
    
    })
    data = {
        listsUser :listsUser,
        listsUserPermission,
        listsPermissions:listsPermissions,
        listsDepartments:listsDepartments,
        message:req.flash('message')
    }
    res.render("../views/group/user-permission/create.handlebars",{data})
}
let store =async(req, res) => {
    try {   
        let user =await db.user_permission.findOne({ where: { userId: req.body.user } })
        if(user){ await db.Admin.update(
            { name: req.body.name },
            { where: { id: id } }
        )
            for(let i = 0; i < req.body.permissions.length ; i++ ){
                await db.user_permission.update(
                    { permissionId:req.body.permissions[i],departmentId:req.body.department,userId:req.body.user},
                    { where: { userId: id } }
                )
            }
        }else{
            for(let i = 0; i < req.body.permissions.length ; i++ ){
                const permission = await db.user_permission.create({ permissionId:req.body.permissions[i],departmentId:req.body.department,userId:req.body.user});
            }
        }
      
          
        req.flash('message', 'saved successfully');
        res.redirect("/group/user-permission/create")
     
      }catch (err) {
        res.send(err);
      }
}

let edit =async (req,res) => {
   
    let id = req.params.id
    let listsUser =  await db.Admin.findAll({
        
    })
    
    let listsPermissions =  await db.permissions.findAll({
    
    })
    let listsDepartments =  await db.departments.findAll({
    
    })
    let listUserPermissions = await db.user_permission.findAll({
        where:{id:id},
        include: [
            {
                model:db.departments
            },
            {
                model:db.permissions
            },
            {
                model:db.Admin
            }
        ]
    })
    
    if(listUserPermissions){
        let data = {
            listsUser :listsUser,
            listsPermissions:listsPermissions,
            listsDepartments:listsDepartments,
            listUserPermissions:listUserPermissions,
            message:req.flash('message')
        }
        res.render("../views/group/user-permission/edit.handlebars",data)
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
            res.redirect("/group/user-permission/edit/"+id)
      }catch (err) {
        res.send(err);
      }
}
let destroy = async(req, res) => {
    let id = req.params.id
    try {
        await db.user_permission.destroy(
        
            { where: { id: id } }
        )
            req.flash('message', 'delete successfully');
            res.redirect("/group/user-permission/")
      }catch (err) {
        res.send(err);
      }
}


module.exports = {
    show,create, store, edit,update,destroy
}
       