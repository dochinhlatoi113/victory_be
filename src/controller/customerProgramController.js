const db = require("../models/index")
const { Op } = require("sequelize");
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
        lists: lists
    }
    res.render("../views/customer/create.handlebars", { data })
}
let store = async (req, res) => {
    let dataCreate = {
        programs: req.body.programs,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        sex: req.body.sex,
        phone: req.body.phone,
        dob: req.body.dob,
        nameRelation: req.body.nameRelation,
        childrenSex: req.body.childrenSex,
        note: req.body.note,
        date:req.body.date,
        children:req.body.children
    }
    console.log("child>>",dataCreate.children.toString())
    console.log("date>>",dataCreate.date.toString())
    return false
    // for(let i = 0 ; i < req.files.length ; i++) {
    //         console.log(req.files[i].filename)
    // }return false
    try {
        let lists = await db.programs.findOne({ where: { code: req.body.code, name: req.body.name } })
        if (lists) {
            req.flash('messageErr', 'đã tồn tại chương trình này rồi');
            return res.redirect("/customer/create")
        }
        await db.programs.create({ code: req.body.code, country: req.body.country, name: req.body.name, status: req.body.status ? req.body.status : 0 });
        req.flash('message', 'saved successfully');
        res.redirect("/customer/")
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
