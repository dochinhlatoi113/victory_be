const db = require("../models/index");
const contracts = require("../models/contracts")
const { Op, transaction } = require("sequelize");
const e = require("connect-flash");
const { readFile } = require("@babel/core/lib/gensync-utils/fs");
const { text } = require("body-parser");
let show = async (req, res) => {
    let keyWord = req.query.keyWord;
    let itemPerPage = 10;
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
       
       let salesId =  req.user.departmentsId == 2 ? req.user.userId :  req.body.salesId
        let data = {
            no: req.body.no,
            representative: req.body.representative,
            customerId: req.body.customer,
            customerName: req.body.name,
            serviceFee: req.body.serviceFee,
            paymentTimeLine: req.body.paymentTimeLine,
            note: req.body.note,
            salesId: salesId,
            status:1
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
                    mediaFiles: "/image/fileCustomer/" + req.files[i].filename
                })
            }
        }
        /**
         * update status customer
         */
        let customerContract = await db.customers.findOne({id:contracts.customerId})
        if(customerContract){
            await db.customers.update({status:0},{where:{id:contracts.customerId}})
        }
        req.flash('message', 'saved successfully');
        res.redirect("/contract/")


    } catch (error) {
        return res.json(error)
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
            listsCustomers: listsCustomers,
            listsSales: listsSales,
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
        let dataContracts = {
            no: req.body.no,
            representative: req.body.representative,
            customerId: req.body.customer,
            customerName: req.body.name,
            serviceFee: req.body.serviceFee,
            paymentTimeLine: req.body.paymentTimeLine,
            note: req.body.note,
            salesId: req.body.salesId,
            status : req.body.status
        }
     
        if(req.files.length > 0 && !req.body.key){
            for (let i = 0; i < req.files.length; i++) {
                await db.medias.create({
                    model: 'contracts',
                    modelId: id,
                    mediaFiles: "/image/fileCustomer/" + req.files[i].filename
                })
            }
        }
        const listsMedias = await db.links.findOne(
            {
                where: {modelId: id,model:'contracts' }
            });
            
        if (listsMedias) {
            await db.links.update({ linkFiles: req.body.link, modelId:id, model: 'contracts' }, { where: { modelId: id, model: 'contracts' } })         
        }

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
  
        if(listsContracts) {
            await db.contracts.update(dataContracts,{where:{id:id}})
        }
        req.flash('message', 'saved successfully');
        res.redirect("/contract/edit/" + id)
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



