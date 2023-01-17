const db = require("../models/index")
const { Op } = require("sequelize");
const secretKey = require("../controller/auth/customer/passport")
const jwt = require('jsonwebtoken');
/**
 * 
 * @param {keyWord,page} req 
 * @param {view} res 
 * @returns 
 */
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 10;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    
    try {
        if (keyWord != undefined) {
            let totalItems = await db.programs.count({
                where: {
                    [Op.or]: [{
                        name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        code: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                }
            })
            let lists = await db.programs.findAll({
                where: {
                    [Op.or]: [{
                        name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        code: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                },
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
            res.render("../views/customer_account/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = async(req, res) => {
    let lists =  await db.customers.findAll();
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message'),
        lists:lists
    }
 
    res.render("../views/customer_account/create.handlebars", { data })
}
let store = async (req, res) => {
    try {
        let lists = await db.customer_accounts.findOne({ where: { account: req.body.name, customerId: req.body.customerId } })
        if (lists) {
            req.flash('messageErr', 'đã tạo account cho khách hàng này rồi');
            return res.redirect("/customer_account/create")
        }
        await db.programs.create({ account: req.body.code, password: req.body.country, customerId: req.body.name});
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
        res.render("../views/customer_account/edit.handlebars", data)
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
        res.redirect("/customer_account/edit/" + id)
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
    if(idStatus == 0){
        await db.programs.update({status:1},{where:{id:idPrograms}})
    }
    if(idStatus == 1){
        await db.programs.update({status:0},{where:{id:idPrograms}})
    }

}

// let login = async(req,res) => {
//     let list = await db.customer_accounts.findOne({
//         where:{
//             account:req.body.name,
//             password:req.body.password
//         }
//     })
//     if(list){
//         let token = jwt.sign(payload.process.env.SESSION_SECRET);
//        return res.json({ msg: 'ok', token: token });
//     }else {
//         return res.status(401).json({ msg: 'Password is incorrect' });
//       }
// }
module.exports = {
    show, create, store, edit, update, destroy, changeStatus
}
