const db = require("../models/index")
const { QueryTypes, Op } = require("sequelize");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
        if (keyWord != undefined) {
            let totalItems = await db.user_permission.count({
                include: [{
                    model: db.departments
                },
                {
                    model: db.permissions
                },
                {
                    model: db.Admin
                }],
                where: { '$Admin.email$': { [Op.like]: `%${keyWord}%` } },
            })

            let lists = await db.user_permission.findAll({

                include: [{
                    model: db.departments
                },
                {
                    model: db.permissions
                },
                {
                    model: db.Admin
                }],
                where: { '$Admin.email$': { [Op.like]: `%${keyWord}%` } },
                limit: itemPerPage,
                offset: offset,
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
            res.render("../views/group/user-permission/show.handlebars", data)
        } else {
            let totalItems = await db.user_permission.count({


            })
            let lists = await db.user_permission.findAll({
                include: [{
                    model: db.departments
                },
                {
                    model: db.permissions
                },
                {
                    model: db.Admin
                }],
                limit: itemPerPage,
                offset: offset,
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
                message: req.flash('message')
            }
            res.render("../views/group/user-permission/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = async (req, res) => {
    let listsUserPermission = await db.user_permission.findAll({

        include: [
            {
                model: db.Admin
            }],
        order: [['id', 'DESC']],
    });

    let listsUser = await db.Admin.findAll({

    })

    let listsPermissions = await db.permissions.findAll({

    })
    let listsDepartments = await db.departments.findAll({

    })
    data = {
        listsUser: listsUser,
        listsUserPermission,
        listsPermissions: listsPermissions,
        listsDepartments: listsDepartments,
        message: req.flash('message'),
        messageErr: req.flash('messageErr'),
    }
    res.render("../views/group/user-permission/create.handlebars", { data })
}
let store = async (req, res) => {
    if (req.method == "POST") {
        try {
            for (let i = 0; i < req.body.permissions.length; i++) {
                await db.user_permission.findOrCreate({
                    where: {
                        userId: req.body.user,
                        departmentId: req.body.department,
                        permissionId: req.body.permissions[i]
                    }
                })
            }
            req.flash('message', 'saved successfully');
            res.redirect("/group/user-permission/create")

        } catch (err) {
            res.send(err);
        }
    }
}

let edit = async (req, res) => {

    let id = req.params.id
    let userId = req.params.userid


    let listsUser = await db.Admin.findAll({

    })

    let listsPermissions = await db.permissions.findAll({

    })
    let listsDepartments = await db.departments.findAll({

    })
    let listUserPermissions = await db.user_permission.findOne({
        where: { id: id },
        include: [
            {
                model: db.departments
            },
            {
                model: db.permissions
            },
            {
                model: db.Admin
            }
        ]
    })

    let listUserPermission = await db.user_permission.findAll({
        where: { userId: userId },
        include: [
            {
                model: db.departments
            },
            {
                model: db.permissions
            },
            {
                model: db.Admin
            }
        ]
    })

    if (listUserPermissions) {
        let data = {
            listsUser: listsUser,
            listsPermissions: listsPermissions,
            listsDepartments: listsDepartments,
            listUserPermissions: listUserPermissions,
            listUserPermission: listUserPermission,
            message: req.flash('message'),
            messageErr: req.flash('messageErr'),
        }
        res.render("../views/group/user-permission/edit.handlebars", data)
    } else {
        res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    let id = req.params.id
    try {
        if (req.body.permissions == undefined) {
            await db.user_permission.destroy(

                { where: { userId: req.body.userIds } }
            )
            req.flash('message', 'delete successfully');
            return res.redirect("/group/user-permission/")
        }

        let user = await db.user_permission.findAll({ where: { userId: req.body.userIds } })

        if (user) {

            await db.user_permission.destroy(

                { where: { userId: req.body.userIds } }
            )

            for (let i = 0; i < req.body.permissions.length; i++) {

                const permission = await db.user_permission.create({ permissionId: req.body.permissions[i], departmentId: req.body.department, userId: req.body.userIds });
            }

        }

        //   return false
        req.flash('message', 'updated successfully');
        return res.redirect("/group/user-permission/")


    } catch (err) {
        res.send(err);
    }
}
let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.user_permission.destroy(

            { where: { id: id } }
        )
        req.flash('message', 'delete successfully');
        res.redirect("/group/user-permission/")
    } catch (err) {
        res.send(err);
    }
}


module.exports = {
    show, create, store, edit, update, destroy
}
