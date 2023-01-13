const db = require("../models/index");
const contracts = require("../models/contracts")
const { Op, transaction } = require("sequelize");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
const { text } = require("body-parser");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
        if (keyWord != undefined) {
            let totalItems = await db.contracts.count({
                // where: { name: { [Op.like]: `%${keyWord}%` } },
                include: [
                    {
                        model: db.customers,
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
                    },
                    {
                        model: db.Admin
                    }
                ],
                where: {
                    [Op.or]: [{
                        no: {
                            [Op.like]: `%${keyWord}%`
                        },

                    },
                    {
                        '$Admin.firstName$': {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        '$customer.name$': {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                    ]
                }
            })
            let lists = await db.contracts.findAll({
                // where: { name: { [Op.like]: `%${keyWord}%` } },
                include: [
                    {
                        model: db.customers,
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
                    },
                    {
                        model: db.Admin
                    }
                ],
                where: {
                    [Op.or]: [{
                        no: {
                            [Op.like]: `%${keyWord}%`
                        },

                    },
                    {
                        '$Admin.firstName$': {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        '$customer.name$': {
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

            return res.render("../views/contract/show.handlebars", data)
        } else {
            let totalItems = await db.contracts.count({

            });
            let lists = await db.contracts.findAll({
                limit: itemPerPage,
                offset: offset,
                include:
                    [
                        {
                            model: db.customers,
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
                        },
                        {
                            model: db.Admin
                        }
                    ],
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

            return res.render("../views/contract/show.handlebars", data)
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
    res.render("../views/contract/create.handlebars", { data })
}
/**
 * 
 * @param {cutomerId,name,image,} req 
 * @param {insert into db.contract} res 
 */
let store = async (req, res) => {
    try {
        // define variable and object
        let data = {
            no: req.body.no,
            representative: req.body.representative,
            customerId: req.body.customer,
            customerName: req.body.name,
            serviceFee: req.body.serviceFee,
            paymentTimeLine: req.body.paymentTimeLine,
            note: req.body.note,
            salesId: req.body.salesId
        }

        //end define variable and object
        /**
         * insert data into db.contract
         */


        let contracts = await db.contracts.create(data)
        let links = await db.links.create({ linkFiles: req.body.link, modelId: contracts.id, model: 'contracts' })
        if (req.files.length != "") {
            for (let i = 0; i < req.files.length; i++) {
                await db.medias.create({
                    model: 'contracts',
                    modelId: contracts.id,
                    mediaFiles:"/image/fileCustomer/" + req.files[i].filename
                })
            }
        }

        return res.render("../views/contract/show.handlebars")


    } catch (error) {

    }
}

let edit = async (req, res) => {
    let id = req.params.id
    let customerId = req.body.customerId
    const listsMedias = await db.medias.findAll(
        {
            where: { modelId: id, model: 'contracts' }
        });
    const listsLinks = await db.links.findOne(
        {
            where: { modelId: id, model: 'contracts' }
        });
    const listsCustomers = await db.customers.findAll()
    const listsSales = await db.Admin.findAll()
    const listsContracts = await db.contracts.findOne(
       
        {
           include:
                [
                    {
                        model: db.customers,
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
                    },
                    {
                        model: db.Admin
                    }
                ],
            
                 where: { id: id },
        },
      
    );
     //return res.json(listsContracts)
    //     return false
    // const listsMedias =  await db.medias.findOne({where:{model:"customers", modelId:id}}) 

    if (listsContracts) {
        let data = {
            id: id,
            listsContracts: listsContracts,
            listsMedias: listsMedias,
            listsLinks: listsLinks,
            listsCustomers:listsCustomers,
            listsSales:listsSales,
            message: req.flash('message')
        }
        return res.render("../views/contract/edit.handlebars", data)
    } else {
        return res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    try {
        let id = req.params.id
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
                            model: db.medias,
                            where: {
                                model: "customers",
                                modelId: id
                            }
                        },
                        {
                            model: db.notesCustomers,
                        },
                        {
                            model: db.links,
                            where: {
                                model: "customers",
                                modelId: id
                            }
                        },
                    ],
                where: { id: id }
            });
        if (listsCustomers) {

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
            await db.customers.update(
                dataCreateCustomer,
                { where: { id: id } },
                {
                    include: [{
                        model: db.customer_programs,
                        attributes: { programId: id, customerId: req.body.programs }
                    },
                    {
                        model: db.childrens,
                        where: {
                            customerId: id
                        }
                    }
                    ]
                }
            );

            return res.json("oke")
            // let dataNotes = {
            //     customerId: listCustomer.id,
            //     content: req.body.notes
            // }
            // let dataCustomerPrograms = {
            //     customerId: listCustomer.id,
            //     programId: req.body.programs
            // }
            // await db.childrens.create(dataCreateChildren)
            // await db.notesCustomers.create(dataNotes)
            // for (let i = 0; i < req.files.length; i++) {
            //     await db.medias.create({ modelId: listCustomer.id, model: 'customers', mediaFiles: req.files[i].filename });
            // }
            // // await db.medias.bulkCreate(dataLinkMedia, { returning: true, ignoreDuplicates: true })
            // // await db.links.bulkCreate(dataLinks, { returning: true })
            // for (let i = 0; i < req.body.links.length; i++) {
            //     await db.links.create({ modelId: listCustomer.id, model: 'customers', linkFiles: req.body.links[i] });
            // }
            // await db.customer_programs.create(dataCustomerPrograms)
            req.flash('message', 'saved successfully');
            res.redirect("/customer/create")
        }


    } catch (err) {
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



module.exports = {
    show, create, store, edit, update, destroy
}


// 



