const db = require("../models/index")
const { Op } = require("sequelize");
let oldInput = require('old-input');
const moment = require("moment");
const regexPhoneNumber = require("../helper/phone")
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

let store = async (req, res) => {
    try {  
       
        let dataCreateCustomer = {
            name: req.body.name,
            phone: req.body.phone,
            sex: req.body.sex,
            // dob: new Date(req.body.dob).toLocaleDateString("vi"),
            dob:new Date(req.body.dob).toLocaleDateString("vi-VI"),
            nameRelation: req.body.nameRelation,
            sex2: req.body.sex2,
            email: req.body.email,
            dob2:new Date(req.body.dob2).toLocaleDateString("vi-VI")
        }
        let listCustomer = await db.customers.create(dataCreateCustomer);
        
        let dataCreateChildren = {
            sex: req.body.childrenSex.toString(),
            dob: req.body.date.toString(),
            name: req.body.childrenName.toString(),
            customerId: listCustomer.id
        }

        let dataNotes = {
            customerId: listCustomer.id,
            content: req.body.notes
        }
        let dataCustomerPrograms = {
            customerId: listCustomer.id,
            programId: req.body.programs
        }
        await db.childrens.create(dataCreateChildren)
        await db.notesCustomers.create(dataNotes)
        for (let i = 0; i < req.files.length; i++) {
            await db.medias.create({ modelId: listCustomer.id, model: 'customers', mediaFiles: req.files[i].filename });
        }
        // await db.medias.bulkCreate(dataLinkMedia, { returning: true, ignoreDuplicates: true })
        // await db.links.bulkCreate(dataLinks, { returning: true })
        for (let i = 0; i < req.body.links.length; i++) {
            await db.links.create({ modelId: listCustomer.id, model: 'customers', linkFiles: req.body.links[i] });
        }
        await db.customer_programs.create(dataCustomerPrograms)
        req.flash('message', 'saved successfully');
        res.redirect("/customer/create")
   
    } catch (err) {
        res.send(err);
    }
}

let edit = async (req, res) => {
    let id = req.params.id
    // const customers = sequelize.define('customers');
    //   const programs = sequelize.define('programs');
    //   customers.belongsToMany(programs, { through: "customer_programs", onDelete: 'cascade', onUpdate:'CASCADE',
    //    });
    //   programs.belongsToMany(customers, { through: "customer_programs",onDelete: 'cascade', onUpdate:'CASCADE',
    // });
    const lists = await db.customers.findOne(
        {
            include:
                [
                    {
                        model: db.childrens
                    },
                    {
                        model: db.programs
                    },
                ],

            where: { id: id }
        });
    if (lists) {
        let data = {
            id: id,
            message: req.flash('message')
        }
       return res.render("../views/customer/edit.handlebars", {data})
    } else {
        return  res.render("../views/error/error.handlebars", { layout: null })
    }
}
let update = async (req, res) => {
    try {    
        let id = req.params.id
        let dataCreateCustomer = {
            name: req.body.name,
            phone: req.body.phone,
            sex: req.body.sex,
            // dob: new Date(req.body.dob).toLocaleDateString("vi"),
            dob:new Date(req.body.dob).toLocaleDateString("vi-VI"),
            nameRelation: req.body.nameRelation,
            sex2: req.body.sex2,
            email: req.body.email,
            dob2:new Date(req.body.dob2).toLocaleDateString("vi-VI")
        }
        console.log(dataCreateCustomer)
         listCustomer = await db.customers.update(
            dataCreateCustomer,
            {where:{id:id}},
            {include:[{
                model:db.customer_programs,
                attributes: {programId:id,customerId:req.body.programs}
            }]}
            );
        // console.log(">>>>>> thi is sis",dataCreateCustomer)
    //    let list = await db.customers.update(
    //         {name:},
    //         { where: {id:id }}
    //       )
          
         
        let dataCreateChildren = {
            sex: req.body.childrenSex.toString(),
            dob: req.body.date.toString(),
            name: req.body.childrenName.toString(),
            customerId: listCustomer.id
        }
         await db.childrens.update(dataCreateChildren,{where:{customerId:id}});
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
        req.flash('message', 'delete successfully');
        res.redirect("/customer/")
    } catch (err) {
        res.send(err);
    }
}


module.exports = {
    show, create, store, edit, update, destroy
}


// 