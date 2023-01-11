const db = require("../models/index")
const { Op } = require("sequelize");
/**
 * 
 * @param {keyWord,page} req 
 * @param {view} res 
 * @returns 
 */
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
            res.render("../views/category_program/show.handlebars", data)
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
            res.render("../views/category_program/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = (req, res) => {
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message')
    }
    res.render("../views/category_program/create.handlebars", { data })
}
let store = async (req, res) => {
    try {
        let lists = await db.programs.findOne({ where: { code: req.body.code, name: req.body.name } })
        if (lists) {
            req.flash('messageErr', 'đã tồn tại chương trình này rồi');
            return res.redirect("/category_program/create")
        }
        await db.programs.create({ code: req.body.code, country: req.body.country, name: req.body.name, status: req.body.status ? req.body.status : 0 });
        req.flash('message', 'saved successfully');
        res.redirect("/category_program/")
    } catch (err) {
        res.send(err);
    }
}

let edit = async (req, res) => {
    let id = req.params.id
    const lists = await db.programs.findOne({ where: { id: id } });

    if (lists) {
        let data = {
            id: id,
            lists: lists,
            message: req.flash('message')
        }
        res.render("../views/category_program/edit.handlebars", data)
    } else {
        res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    let id = req.params.id
    let data = {
        name: req.body.name,
        status: req.body.status == undefined ? 0 : 1,
        code: req.body.code,
        country: req.body.country
    }
    try {
        await db.programs.update(
            data,
            { where: { id: id } }
        )
        req.flash('message', 'updated successfully');
        res.redirect("/category_program/edit/" + id)
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
/**
 * 
 * @param {idStatus,idPrograms} req 
 * @param {changeStatus} res 
 */
let changeStatus = async (req, res) => {
    let idStatus = req.params.idStatus
    let idPrograms = req.params.idPrograms
    console.log(idPrograms)

    // if(idStatus == 0){
    //     await db.programs.update({status:1},{where:{id:idPrograms}})
    // }
    // if(idStatus == 1){
    //     await db.programs.update({status:0},{where:{id:idPrograms}})
    // }

}

module.exports = {
    show, create, store, edit, update, destroy, changeStatus
}
