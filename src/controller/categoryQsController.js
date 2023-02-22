const db = require("../models/index");
const contracts = require("../models/contracts")
const { Op, transaction, where } = require("sequelize");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
const { text } = require("body-parser");
const { model } = require("mongoose");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 10;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
     
        if (keyWord != undefined) {
            let totalItems = await db.category_questions.count({
                // where: { name: { [Op.like]: `%${keyWord}%` } },
                include:{
                    model:db.Admins
                },
                where: {
                    [Op.or]: 
                    [
                   
                    {
                        created_by: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        category_name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                }
            })
            let lists = await db.category_questions.findAll({
                // where: { name: { [Op.like]: `%${keyWord}%` } }
                include:{
                    model:db.Admins
                },
                where: {
                    [Op.or]: 
                    [
                   
                    {
                        created_by: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        category_name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                }
            })
            
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

            return res.render("../views/question/category-question/show.handlebars", data)
        } else {
            let totalItems = await db.category_questions.count({

            });
           
            let lists = await db.category_questions.findAll({
                
                limit: itemPerPage,
                offset: offset,
            });
          

            // return res.json(lists)
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

            return res.render("../views/question/category-question/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = async (req, res) => {
    let lists = await db.customers.findAll();
    let sales = await db.Admin.findAll()
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message'),
        oldInput: req.oldInput,
        lists: lists,
        sales: sales
    }
    res.render("../views/question/category-question/create.handlebars", { data })
}
/**
 * 
 * @param {cutomerId,name,image,} req 
 * @param {insert into db.contract} res 
 */
let store = async (req, res) => {
    try {
        // define variable and object
        const t = await db.sequelize.transaction();
       let salesId =  req.user.departmentsId == 2 ? req.user.userId :  req.body.salesId
        let data = {
            category_name: req.body.name,
            created_by: salesId,
        }

        //end define variable and object
        /**
         * insert data into db.contract
         */


        await db.category_questions.create(data,{ transaction: t })
        await t.commit();
       
        req.flash('message', 'saved successfully');
        res.redirect("/category-qs")


    } catch (error) {
        await t.rollback();
        return res.json(error)
    }
}

let edit = async (req, res) => {

    let id = req.params.id
    const lists = await db.category_questions.findOne(
        {
            where: { id: id }
        });


    //return res.json(listsContracts)
    //     return false
    // const listsMedias =  await db.medias.findOne({where:{model:"customers", modelId:id}}) 

    if (lists) {
        let data = {
            id: id,
            lists: lists,
            
           
            message: req.flash('message')
        }
        return res.render("../views/question/category-question/edit.handlebars", data)
    } else {
        return res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    try {
        let id = req.params.id
        const t = await db.sequelize.transaction();
        let salesId =  req.user.departmentsId == 2 ? req.user.userId :  req.body.salesId
         let data = {
             category_name: req.body.name,
             created_by: salesId,
         }
 
         //end define variable and object
         /**
          * insert data into db.contract
          */
      
 
         await db.category_questions.update(data,
           { where:{
            id:id
            }}
            ,{ transaction: t })
         await t.commit();
     
      
        req.flash('message', 'saved successfully');
        res.redirect("/category-qs/edit/" + id)
    } catch (err) {
        res.send(err);
    }
}
let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.category_questions.destroy(
            { where: { id: id } }
        )
        req.flash('message', 'delete successfully');
        res.redirect("/category-qs")
    } catch (err) {
        res.send(err);
    }
}



module.exports = {
    show, create, store, edit, update, destroy
}


// 



