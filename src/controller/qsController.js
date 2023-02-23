const db = require("../models/index")
const { Op } = require("sequelize");
const { model } = require("mongoose");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let categoryFilter = req.query.categoryFilter 
    let keyWorkFilter = req.query.keyWordFilter 
    let itemPerPage = 10;
    let page = +req.query.page || 1
    let sortBy = req.query.sortBy == 'asc' ? 'ASC' : "DESC"
    let offset = (page - 1) * itemPerPage
    try {
      
        if (keyWord != undefined) {
           
            let listCategoryQs = await db.category_questions.findAll()
            let totalItems = await db.questions.count({
                include:
                [
                   { model:db.category_questions}
                ],
                where: {
                    [Op.or]: [
                        
                        {
                            title: {
                                [Op.like]: `%${keyWord}%`
                            }
                        },
                        {
                            content: {
                                [Op.like]: `%${keyWord}%`
                            }
                        },
                        
                    ]
                },
                order: [
                    ['id', sortBy]
                ]
            })
          
            let lists = await db.questions.findAll({
                include:
                [
                   { model:db.category_questions}
                ],
                where: {
                    [Op.or]: [{
                        title: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        content: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                   
                    ]
                },
                limit: itemPerPage,
                offset: offset,
                order: [
                    ['id', sortBy]
                ]
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
                message: req.flash('message'),
                listCategoryQs:listCategoryQs,
            }
            res.render("../views/question/show.handlebars", data)
        } 
        else {
            let listCategoryQs = await db.category_questions.findAll()
            let totalItems = await db.questions.count({

            })
            if(categoryFilter != undefined){
                
                let lists = await db.questions.findAll({
                    include:{
                        model:db.category_questions
                    },
                    limit: itemPerPage,
                    offset: offset,
                    order: [
                        ['id', sortBy]
                    ],
                    where:  
                    {
                        '$category_question.id$': {
                            [Op.like]: `%${categoryFilter}%`
                        },
                        // content: {
                        //     [Op.like]: `%${keyWorkFilter}%`
                        // },
                        title: {
                            [Op.like]: `%${keyWorkFilter}%`
                        },
                        
                    },
                    
                });
                let data = {
                    lists: lists,
                    listCategoryQs:listCategoryQs,
                    currentPage: page,
                    hasNextPage: (itemPerPage * page) < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / itemPerPage),
                    message: req.flash('message')
                }
                res.render("../views/question/show.handlebars", data)
            }
            let lists = await db.questions.findAll({
                include:{
                    model:db.category_questions
                },
                limit: itemPerPage,
                offset: offset,
                order: [
                    ['id', sortBy]
                ],
            }); 
            let data = {
                lists: lists,
                listCategoryQs:listCategoryQs,
                currentPage: page,
                hasNextPage: (itemPerPage * page) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / itemPerPage),
                message: req.flash('message')
            }
            res.render("../views/question/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = (req, res) => {
    res.render("../views/question/create.handlebars", { message: req.flash('message') })
}
let store = async (req, res) => {
    try {
        const department = await db.departments.create({ name: req.body.name });
        req.flash('message', 'saved successfully');
        res.redirect("/question/create")
    } catch (err) {
        res.send(err);
    }
}

let edit = async (req, res) => {
    let id = req.params.id
    const lists = await db.questions.findOne({ where: { id: id } });
    const listCategoryQs = await db.category_questions.findAll()
    if (lists) {
        let data = {
            id: id,
            lists: lists,
            message: req.flash('message'),
            listCategoryQs:listCategoryQs
        }
        res.render("../views/question/edit.handlebars", data)
    } else {
        res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    let id = req.params.id

    try {
        await db.questions.update(
            { category_question_id: req.body.cateQs,
                title:req.body.title,
                content:req.body.content
            },
            { where: { id: id } }
        )
        req.flash('message', 'updated successfully');
        res.redirect("/qs/edit/" + id)
    } catch (err) {
        res.send(err);
    }
}
let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.questions.destroy(

            { where: { id: id } }
        )
        req.flash('message', 'delete successfully');
        res.redirect("/qs")
    } catch (err) {
        res.send(err);
    }
}


module.exports = {
    show, create, store, edit, update, destroy
}
