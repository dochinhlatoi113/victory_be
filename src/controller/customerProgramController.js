const db = require("../models/index")
const { Op, where } = require("sequelize");
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
    let itemPerPage = 2;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    let startDate = req.query.start
    let endDate = req.query.end
    let status = req.query.status
    let program = req.query.program
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
            let programs = await db.programs.findAll();
            let totalItems = await db.customers.count({

            })
            if (startDate != undefined) {
               
                let lists = await db.customers.findAll({
                    where: {
                        [Op.or]: [{
                            createdAt: {
                                [Op.between]: [startDate, endDate]
                            }
                        }, {
                            createdAt: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            status : {
                                [Op.like]: `%${status}%`
                            }
                        },
                    
                    ]
                    },
                    include: [
                        {
                            model: db.notesCustomers,
                        },
                        {
                            model: db.programs
                        }
                    ],


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
                    startDate:startDate,
                    endDate:startDate,
                    status:status,
                    lastPage: Math.ceil(totalItems / itemPerPage),
                    message: req.flash('message'),
                    programs:programs

                }
                // return res.json(lists)
                return res.render("../views/customer/show.handlebars", data)
            }

            let lists = await db.customers.findAll({
                include: [
                    {
                        model: db.notesCustomers,
                    },
                    {
                        model: db.programs
                    }
                ],
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
                programs:programs
            }
            // return res.json(lists)
            return res.render("../views/customer/show.handlebars", data)
        }

    } catch (error) {
        return res.json(error)
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
 * @param {store} 
 */
let store = async (req, res) => {

    try {
        // define array and variable
        let dataCreateCustomer = {
            name: req.body.name,
            sex: req.body.sex,
            // dob: new Date(req.body.dob).toLocaleDateString("vi"),
            dob: new Date(req.body.dob).toLocaleDateString("vi-VI").replace(/\//g, "-"),
            nameRelation: req.body.nameRelation,
            sex2: req.body.sex2,
            email: req.body.email,
            dob2: new Date(req.body.dob2).toLocaleDateString("vi-VI").replace(/\//g, "-"),
            status: req.body.status,
            contact: req.body.contact,
            phone: req.body.phoneMain
        }


        /**
          * insert customers 
          */
        let listCustomer = await db.customers.create(
            dataCreateCustomer
        );
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
             * insert phones into db.phones
        */
        let phone = req.body.phone != "" ? req.body.phone : ""

        for (let i = 0; i < req.body.phone.length; i++) {
            await db.phones.create({ customerId: listCustomer.id, phone: phone[i] });
        }

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
        let links = req.body.links != "" ? req.body.links : ""
        for (let i = 0; i < req.body.links.length; i++) {
            await db.links.create({ modelId: listCustomer.id, model: 'customers', linkFiles: req.body.links[i] });
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
                    {
                        model: db.phones
                    }

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
                phone: req.body.phoneMain,
                sex: req.body.sex,
                // dob: new Date(req.body.dob).toLocaleDateString("vi"),
                dob: new Date(req.body.dob).toLocaleDateString("vi-VI").replace(/\//g, "-"),
                nameRelation: req.body.nameRelation,
                sex2: req.body.sex2,
                email: req.body.email,
                dob2: new Date(req.body.dob2).toLocaleDateString("vi-VI").replace(/\//g, "-"),
                status: req.body.status,
                contact: req.body.contact
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
                { where: { id: id } },
            );
            if (req.body.phone != "") {
                await db.phones.destroy(
                    { where: { customerId: id } }
                )
                for (let i = 0; i < req.body.phone.length; i++) {
                    await db.phones.create(
                        {
                            phone: req.body.phone[i],
                            customerId: id
                        },
                    )
                }
            }


            /**
            * update and create childrens into db.childrens
            */

            if (req.body.childrenName != "") {
                await db.childrens.destroy(
                    { where: { customerId: id } }
                )
                for (let i = 0; i < dataChildren.length; i++) {
                    for (let j = 0; j < dataChildren[i].name.length; j++) {
                        dataCreateChildren.push({ sex: dataChildren[i].sex[j], customerId: id, name: dataChildren[i].name[j], dob: new Date(dataChildren[i].dob[j]).toLocaleDateString("vi-VI").replace(/\//g, "-") })
                    }
                }
                await db.childrens.bulkCreate(dataCreateChildren)
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

            return res.redirect('back');
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
            { where: { id: id } }
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

        if (count == 0) {
            await db.links.create({
                modelId: modelId,
                model: "customers",
                linkFiles: ""
            })
        }

        req.flash('message', 'delete successfully');
        res.redirect('back')
    } catch (error) {
        return res.json(error)
    }
}

/**
 * detroy links
 * @param {id} req 
 * @param {*} res 
 */
let deletePhone = async (req, res) => {
    let idPhone = req.params.idPhone
    let id = req.params.idCustomer

    try {
        await db.phones.destroy(
            { where: { id: idPhone } }
        )
        const count = await db.phones.count({
            where: {
                customerId: id,
            }
        });
        if (count == 0) {
            await db.phones.create(
                {
                    customerId: id,
                    phone: ""
                }
            )
        }
        req.flash('message', 'delete successfully');
        res.redirect('back')
    } catch (error) {
        return res.json(error)
    }
}

module.exports = {
    show, create, store, edit, update, destroy, deleteMedias, deleteLinks, deletePhone
}


// 