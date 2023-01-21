const db = require("../models/index")
const { Op } = require("sequelize");
let oldInput = require('old-input');
const moment = require("moment");
const uploadFileController = require("../controller/uploadFile/uploadFileController")
const regexPhoneNumber = require("../helper/phone");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
/**
 * 
 * @param {keyword,itemPerPage,page,offset} req 
 * @param {pagination,view} res 
 */
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 10;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
        if (keyWord != undefined) {
            let totalItems = await db.customers.count({
                where: {
                    [Op.or]: [{
                        name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                }
            })
            let lists = await db.customers.findAll({
                where: {
                    [Op.or]: [{
                        name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        phone: {
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
            res.render("../views/customer/show.handlebars", data)
        } else {


            let totalItems = await db.customers.count({

            })
            let lists = await db.customers.findAll({
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
/**
 * 
 * @param {*} req 
 * @param {view} res 
 */
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
/**
 * 
 * @param {name,phone,sex,dob,nameRelation,email,sex2} req 
 * @param {store} res 
 */
let store = async (req, res) => {
    try {
        // define array and variable
        let dataCreateCustomer = {
            name: req.body.name,
            phone: req.body.phone,
            sex: req.body.sex,
            // dob: new Date(req.body.dob).toLocaleDateString("vi"),
            dob: new Date(req.body.dob).toLocaleDateString("vi-VI").replace(/\//g, "-"),
            nameRelation: req.body.nameRelation,
            sex2: req.body.sex2,
            email: req.body.email,
            dob2: new Date(req.body.dob2).toLocaleDateString("vi-VI").replace(/\//g, "-")
        }
        let dataChildren = [
            {
                name: req.body.childrenName,
                dob: req.body.date,
                sex: req.body.childrenSex
            }
        ]
        let dataNotes = {
            customerId: listCustomer.id,
            content: req.body.notes
        }
        let dataCustomerPrograms = {
            customerId: listCustomer.id,
            programId: req.body.programs
        }
        let dataCreateChildren = []
        /**
         * insert customers 
         */
        let listCustomer = await db.customers.create(
            dataCreateCustomer
        );

        /**
         * push array into dataChildren 
         */
        for (let i = 0; i < dataChildren.length; i++) {
            for (let j = 0; j < dataChildren[i].name.length; j++) {
                dataCreateChildren.push({ sex: dataChildren[i].sex[j], customerId: listCustomer.id, name: dataChildren[i].name[j], dob: new Date(dataChildren[i].dob[j]).toLocaleDateString("vi-VI") })
            }
        }
        //end define array and variable

        /**
         * insert medias into db.medias
         */
        if (req.files.length != 0) {
            for (let i = 0; i < req.files.length; i++) {
                await db.medias.create({ modelId: listCustomer.id, model: 'customers', mediaFiles: "/image/fileCustomer/" + req.files[i].filename });
            }
        }

        /**
       * insert links into db.links
       */
        if (req.body.links != "") {
            for (let i = 0; i < req.body.links.length; i++) {
                await db.links.create({ modelId: listCustomer.id, model: 'customers', linkFiles: req.body.links[i] });
            }
        }

        /**
         * insert childrens into db.children
         */
        await db.childrens.bulkCreate(dataCreateChildren)

        /**
        * insert notes into notesCustomers
        */
        await db.notesCustomers.create(dataNotes)

        /**
      * insert customer_programs into dataCustomerPrograms
      */
        await db.customer_programs.create(dataCustomerPrograms)
        req.flash('message', 'saved successfully');
        res.redirect("/customer/create")

    } catch (err) {
        res.send(err);
    }
}
/**
 * 
 * @param {id} req 
 * @param {view} res 
 * @returns 
 */
let edit = async (req, res) => {
    let id = req.params.id
    let programs = await db.programs.findAll()
    const listsCustomers = await db.customers.findOne(
        {
            include:
                [
                    {
                        model: db.childrens
                    },
                    {
                        model: db.programs, // customer_program

                    },
                    {
                        model: db.notesCustomers,
                    },

                ],
            where: { id: id }
        });
    const listsMedias = await db.medias.findAll(
        {
            where: { modelId: id, model: 'customers' }
        });
    const listsLinks = await db.links.findAll(
        {
            where: { modelId: id, model: 'customers' }
        });


    if (listsCustomers) {
        let data = {
            id: id,
            listsCustomers: listsCustomers,
            listsMedias: listsMedias,
            listsLinks: listsLinks,
            programs: programs,
            message: req.flash('message')
        }
        return res.render("../views/customer/edit.handlebars", { data })
    } else {
        return res.render("../views/error/error.handlebars", { layout: null })
    }
}
/**
 * 
 * @param {id,idMedias} req 
 * @param {*} res 
 */
let update = async (req, res) => {
    try {
        let id = req.params.id
        let idMedias = req.body.idMedias
        const listsCustomers = await db.customers.findOne(
            {
                include:
                    [
                        {
                            model: db.childrens
                        },
                        {
                            model: db.programs
                        },

                        {
                            model: db.notesCustomers,
                        },

                    ],
                where: { id: id }
            });

        if (listsCustomers) {
            // define variable 
            let dataCreateCustomer = {
                name: req.body.name,
                phone: req.body.phone,
                sex: req.body.sex,
                // dob: new Date(req.body.dob).toLocaleDateString("vi"),
                dob: new Date(req.body.dob).toLocaleDateString("vi-VI").replace(/\//g, "-"),
                nameRelation: req.body.nameRelation,
                sex2: req.body.sex2,
                email: req.body.email,
                dob2: new Date(req.body.dob2).toLocaleDateString("vi-VI").replace(/\//g, "-")
            }
            let dataChildren = [
                {
                    name: req.body.childrenName,
                    dob: req.body.date,
                    sex: req.body.childrenSex
                }
            ]
            let dataCreateChildren = []
            let dataNotes = {
                customerId: id,
                content: req.body.notes
            }
            let dataCustomerPrograms = {
                customerId: id,
                programId: req.body.programs
            }

            // end define variable 

            /**
             * update customers into customers
             */
            await db.customers.update(
                dataCreateCustomer,
                {
                    where: { id: id },
                },
            );

            /**
            * update and create childrens into db.childrens
            */
            if (listsCustomers.childrens.length == 0 || listsCustomers.childrens.length < req.body.childrenName.length) {
                await db.childrens.destroy(
                    { where: { customerId: id } }
                )

                for (let i = 0; i < dataChildren.length; i++) {
                    for (let j = 0; j < dataChildren[i].name.length; j++) {
                        dataCreateChildren.push({ sex: dataChildren[i].sex[j], customerId: id, name: dataChildren[i].name[j], dob: new Date(dataChildren[i].dob[j]).toLocaleDateString("vi-VI").replace(/\//g, "-") })
                    }
                }
                await db.childrens.bulkCreate(dataCreateChildren)
            } else {
                for (let j = 0; j < req.body.idChildren.length; j++) {
                    db.childrens.update(
                        {
                            name: req.body.childrenName[j],
                            dob: new Date(req.body.date[j]).toLocaleDateString("vi-VI").replace(/\//g, "-"),
                            sex: req.body.childrenSex[j]

                        },
                        { where: { customerId: id, id: req.body.idChildren[j] } }
                    )
                }
            }


            /**
            * update notes into db.notesCustomers
            */
            if (req.body.notes != "") {
                await db.notesCustomers.update(dataNotes, { where: { customerId: id } })
            } else {
                await db.notesCustomers.update({ customerId: id, content: "NULL" }, { where: { customerId: id } })
            }

            /**
            * update links into db.links
            */
            if (req.body.links.length != "") {
                await db.links.destroy(
                    { where: { modelId: id, model: "customers" } }
                )
                for (let i = 0; i < req.body.links.length; i++) {
                    await db.links.create({ modelId: id, model: 'customers', linkFiles: req.body.links[i] });
                }
            }

            /**
              * update files into db.medias
              */
            for (let i = 0; i < req.files.length; i++) {
                await db.medias.create({ modelId: id, model: 'customers', mediaFiles: "/image/fileCustomer/" + req.files[i].filename });
            }

            /**
             * update customer_programs into db.customer_programs
             */
            await db.customer_programs.update(dataCustomerPrograms, { where: { customerId: id } })
            req.flash('message', 'saved successfully');
            res.redirect("/customer/edit/" + id)
        }


    } catch (err) {
        res.send(err);
    }
}

/**
 * 
 * @param {id} req 
 * @param {*} res 
 */
let destroy = async (req, res) => {
    let id = req.params.id
    try {
        await db.customers.destroy(
            {
                where: { id: id },
                include: [
                    {
                        model: await db.childrens,
                        where: {
                            customerId: id
                        }
                    }, 
                    {
                        model: await db.notesCustomers,
                        where: {
                            customerId: id
                        }
                    }, 
                ]
            }
        )
        await db.medias.destroy({ where: { model: "customers", modelId: id } })
        await db.links.destroy({ where: { model: "customers", modelId: id } })
        req.flash('message', 'delete successfully');
        res.redirect("/customer/")
    } catch (err) {
        res.send(err);
    }
}

/**
 * detroy medias
 * @param {id} req 
 * @param {*} res 
 */
let deleteMedias = async (req, res) => {
    let id = req.params.idDelete
    let modelId = req.body.modelId
    try {
        let medias = await db.medias.findOne(
            {
                where: {
                    id: id,
                    modelId: modelId
                }
            }
        )
        uploadFileController.getFilesInDirectory(medias.mediaFiles);

        await db.medias.destroy(
            { where: { id: id, model: "customers" } }
        )
        const count = await db.medias.count({
            where: {
                modelId: modelId,
                model: "customers"
            }
        });

        req.flash('message', 'delete successfully');
        res.redirect('back')
    } catch (err) {
        res.send(err);
    }
}
/**
 * detroy links
 * @param {id} req 
 * @param {*} res 
 */
let deleteLinks = async (req, res) => {
    let id = req.params.idDelete
    let modelId = req.body.modelId
    try {
        await db.links.destroy(
            { where: { id: id, model: "customers" } }
        )
        const count = await db.links.count({
            where: {
                modelId: modelId,
                model: "customers"
            }
        });
        req.flash('message', 'delete successfully');
        res.redirect('back')
    } catch (error) {
        return res.json(error)
    }
}
module.exports = {
    show, create, store, edit, update, destroy, deleteMedias, deleteLinks
}


// 