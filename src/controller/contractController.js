const db = require("../models/index");
const { Op, transaction } = require("sequelize");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 3;
    let page = +req.query.page || 1
    let offset = (page - 1) * itemPerPage
    try {
        if (keyWord != undefined) {
            let totalItems = await db.customers.count({
                // where: { name: { [Op.like]: `%${keyWord}%` } },
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
            res.render("../views/contract/show.handlebars", data)
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

            res.render("../views/contract/show.handlebars", data)
        }

    } catch (error) {
        error
    }
}
let create = async (req, res) => {
    let lists = await db.customers.findAll();
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message'),
        oldInput: req.oldInput,
        lists: lists
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
            no : req.body.no,
            representative: req.body.representative,
            customerId : req.body.customer,
            name:req.body.name,
            serviceFee:req.body.serviceFee ,
            paymentTimeLine:req.body.paymentTimeLine ,
            link:req.body.link,
            note:req.body.note
        }
       
        //end define variable and object
        /**
         * insert data into db.contract
         */
        
            
          let contracts =   await db.contracts.create(data)
            if(req.files.length != ""){
                for(let i =0 ; i < req.files.length ; i++){ 
                    await db.medias.create({
                        model:'contracts',
                        modelId:contracts.id,
                        mediaFiles:req.files[i].filename
                    })
                }
            }
           
            return res.render("../views/contract/show.handlebars")
          
     
    } catch (error) {

    }
}

let edit = async (req, res) => {
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
    //return res.json(listsCustomers)
    //    return false
    // const listsMedias =  await db.medias.findOne({where:{model:"customers", modelId:id}}) 

    if (listsCustomers) {
        let data = {
            id: id,
            listsCustomers: listsCustomers,
            message: req.flash('message')
        }
        return res.render("../views/contract/edit.handlebars", { data })
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

let deleteMedias = async (req, res) => {
    let id = req.params.idDelete
    let modelId = req.body.modelId
    try {
        await db.medias.destroy(
            { where: { id: id, model: "customers" } }
        )
        const count = await db.medias.count({
            where: {
                modelId: modelId,
                model: "customers"
            }
        });
        if (count == 0) {
            await db.medias.create({ modelId: modelId, model: 'customers', mediaFiles: "NULL" });
        }
        req.flash('message', 'delete successfully');
        res.redirect("/contract/edit/" + modelId)
    } catch (err) {
        res.send(err);
    }
}
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
            await db.links.create({ modelId: modelId, model: 'customers', mediaFiles: "NULL" });
        }
        req.flash('message', 'delete successfully');
        res.redirect("/contract/edit/" + modelId)
    } catch (error) {
        return res.json(error)
    }
}
module.exports = {
    show, create, store, edit, update, destroy
}


// 