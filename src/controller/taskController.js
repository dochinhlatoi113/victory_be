const db = require("../models/index");
const contracts = require("../models/contracts")
const { Op, transaction } = require("sequelize");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
const { text } = require("body-parser");
let show = async (req, res) => {
    const keyWord = req.query.keyWord || '';
    let itemPerPage = 1;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage;
    const status = req.query.status || '';
    let firstPageUrl = `?page=1&keyWord=${keyWord}&status=${status}`;

    try {
        const included = [
            {
                model: db.task_admins,
                include: {
                    model: db.Admin,
                    as: 'Admin',
                    
                },
               
            }
        ];
        const whereClause = {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${keyWord}%`
                    }
                },
              
            ]
        };
        if (status) {
            whereClause.status = status;
        }
        let totalItems;
        let lists;

        if (req.user.departments === "phòng giám đốc") {
            totalItems = await db.tasks.count({
                where: whereClause,
                include: included
            });

            lists = await db.tasks.findAll({
                where: whereClause,
                include: included,
                limit: itemPerPage,
                offset: offset
            });

        } else {
            totalItems = await db.tasks.count({
                where: whereClause,
                include: {
                    model: db.task_admins,
                    include: {
                        model: db.Admin
                    },
                    where: {
                        '$task_admins.userId$': req.user.userId
                    }
                }
            });
            lists = await db.tasks.findAll({
                where: whereClause,
                include: {
                    model: db.task_admins,
                    include: {
                        model: db.Admin,
                        attributes: ['firstName']
                    },
                    where: {
                        '$task_admins.userId$': req.user.userId
                    }
                },
                limit: itemPerPage,
                offset: offset
            });
        }

        let totalPages = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
            let url = `?page=${i}&keyWord=${keyWord}`;
            if (status) url += `&status=${status}`;
            totalPages.push({
                number: i,
                isCurrent: i === page,
                url: url
            });
        }

        const data = {
            lists: lists,
            currentPage: page,
            hasNextPage: (itemPerPage * page) < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemPerPage),
            status: status,
            message: req.flash('message'),
            keyWord: keyWord,
            totalItems: totalItems,
            totalPages: totalPages,
            firstPageUrl: firstPageUrl
        };

        return res.render('../views/task/show.handlebars', data);
    } catch (error) {
        return res.json(error);
    }
};


let create = async (req, res) => {
    let admin = await db.Admin.findAll()
    let data = {
        message: req.flash('message'),
        admin: admin
    }

    res.render("../views/task/create.handlebars", data)
}
/**
 * 
 * @param {cutomerId,name,image,} req 
 * @param {insert into db.contract} res 
 */
let store = async (req, res) => {
    try {

        await db.sequelize.transaction(async (t) => {
            // define variable and object
            let data = {
                title: req.body.title,
                department: req.user.departments,
                content: req.body.notes,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                status: "0"
            };

            let arrList = []
            // end define variable and object
            /**
             * insert data into db.contract
             */

            let tasks = await db.tasks.create(data, { transaction: t })
            for (let i = 0; i < req.body.userId.length; i++) {
                let lists = await db.user_permission.findOne(
                    {
                        where: {
                            userId: req.body.userId[i]
                        }
                    }
                )
                arrList.push(lists)
            }
            for (let i = 0; i < arrList.length; i++) {
                let task_admins = await db.task_admins.create({
                    userId: req.body.userId[i],
                    taskId: tasks.id,
                    department: arrList[i].departmentId,
                }, { transaction: t })
            }

            /**
             * update status customer
             */

            req.flash('message', 'saved successfully')
            return res.redirect("/task/")
        })
    } catch (error) {
        return res.json(error)
    }
}
let edit = async (req, res) => {
    let id = req.params.id
    let lists = await db.tasks.findOne({
        include: {
            model: db.task_admins,
            include: {
                model: db.Admin
            }
        },
        where: {
            id: id
        }
    })

    if (lists) {
        let data = {
            lists: lists,
            message: req.flash('message')
        }
        return res.render("../views/task/edit.handlebars", data)
    } else {
        return res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    let id = req.params.id;
    const t = await db.sequelize.transaction();
    try {
        let updateData = { status: req.body.status };
        if (req.user.departments === "phòng giám đốc") {
            updateData.content = req.body.notes;
            updateData.fromDate = req.body.fromDate;
            updateData.toDate = req.body.toDate;
        }
        let lists = await db.tasks.update(
            updateData,
            { where: { id: id }, transaction: t }
        );
        await t.commit();
        req.flash('message', 'đã phê duyệt thành công');
        res.redirect("/task/edit/" + id);
    } catch (err) {
        await t.rollback();
        res.send(err);
    }
}

let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.customers.destroy(
            { where: { id: id } }
        )
        await db.medias.destroy({ where: { model: "customers", modelId: id } })
        await db.links.destroy({ where: { model: "customers", modelId: id } })
        req.flash('message', 'delete successfully');
        res.redirect("/contract/")
    } catch (err) {
        res.send(err);
    }
}

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    // const hours = ("0" + date.getHours()).slice(-2);
    // const minutes = ("0" + date.getMinutes()).slice(-2);
    // const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}`;
}

module.exports = {
    show, create, store, edit, update, destroy
}


// 



