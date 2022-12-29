const db = require("../models/index")
const { Op } = require("sequelize");
var oldInput = require('old-input');

let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
        if (keyWord != undefined) {
            let totalItems = await db.programs.count({
                where: { name: { [Op.like]: `%${keyWord}%` } },
            })
            let lists = await db.programs.findAll({
                where: { name: { [Op.like]: `%${keyWord}%` } },
                limit: itemPerPage,
                offset: offset
            });
            let data = {
                lists: lists,
                currentPage: page,
                hasNextPage: (itemPerPage * page) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                keyWord: keyWord,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / itemPerPage),
                message: req.flash('message')
            }
            res.render("../views/customer/show.handlebars", data)
        } else {
            let totalItems = await db.programs.count({

            })
            let lists = await db.programs.findAll({
                limit: itemPerPage,
                offset: offset
            });

            let data = {
                lists: lists,
                currentPage: page,
                hasNextPage: (itemPerPage * page) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / itemPerPage),
                message: req.flash('message'),

            }
            
            res.render("../views/customer/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = async (req, res) => {
    let lists = await db.programs.findAll();
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message'),
        oldInput: req.oldInput,
        lists: lists
    }
    res.render("../views/customer/create.handlebars", { data })
}

let store = async (req, res) => {
    try {
      
        let dataCreateCustomer = {
            name: req.body.name,
            phone: req.body.phone,
            sex: req.body.sex,
            dob: new Date(req.body.dob).toLocaleDateString("vi"),
            nameRelation: req.body.nameRelation,
            sex2:req.body.sex2,
            dob2: new Date(req.body.dob2).toLocaleDateString("vi")
        }
       let listCustomer = await db.customers.create(dataCreateCustomer);

        let dataCreateChildren = {
            sex: req.body.childrenSex.toString(),
            dob:req.body.date.toString(),
            name:req.body.childrenName.toString(),
            customerId :listCustomer.id
        }
     
        let dataNotes = {
            customerId :listCustomer.id,
            content:req.body.notes
        }
       
        let dataLinkMedia = {
            modelId: listCustomer.id,
            model:'customers',
            mediaFiles : req.files.filename
        }
       let dataLinks = {
            modelId: listCustomer.id,
            model:'customers',
            linkFiles : req.body.links
       }
       await db.childrens.create(dataCreateChildren)
       await db.notesCustomers.create(dataNotes)
       await db.medias.bulkCreate([dataLinkMedia, {returning: true}])
       await db.links.blukCreate([dataLinks,{returning: true}])
        req.flash('message', 'saved successfully');
        res.redirect("/customer/create")
    } catch (err) {
        res.send(err);
    }
}

let edit = async (req, res) => {
    let id = req.params.id
    const checkDepartment = await db.programs.findOne({ where: { id: id } });

    if (checkDepartment) {
        let data = {
            id: id,
            checkDepartment: checkDepartment,
            message: req.flash('message')
        }
        res.render("../views/customer/edit.handlebars", data)
    } else {
        res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    let id = req.params.id

    try {
        await db.programs.update(
            { name: req.body.name },
            { where: { id: id } }
        )
        req.flash('message', 'updated successfully');
        res.redirect("/group/customer/edit/" + id)
    } catch (err) {
        res.send(err);
    }
}
let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.departments.destroy(

            { where: { id: id } }
        )
        req.flash('message', 'delete successfully');
        res.redirect("/group/department")
    } catch (err) {
        res.send(err);
    }
}


module.exports = {
    show, create, store, edit, update, destroy
}


// 