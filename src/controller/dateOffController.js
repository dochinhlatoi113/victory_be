const db = require("../models/index")
const { Op, where } = require("sequelize");
let oldInput = require('old-input');
const moment = require("moment");
const uploadFileController = require("./uploadFile/uploadFileController")
const regexPhoneNumber = require("../helper/phone");
const e = require("connect-flash");
const { readFile, stat } = require("@babel/core/lib/gensync-utils/fs");
const customer_programs = require("../models/customer_programs");
const Excel = require('exceljs');
/**
 * 
 * @param {keyword,itemPerPage,page,offset} req 
 * @param {pagination,view} res 
 */
let show = async (req, res) => {
    const keyWord = req.query.keyWord || '';
    const itemPerPage = 20;
    const page = +req.query.page || 1;
    const offset = (page - 1) * itemPerPage;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status || '';
    const program = req.query.program || null;
    const regexStatusNumber = new RegExp('^[0-9]+$').test(status);
    const regexProgramNumber = new RegExp('^[0-9]+$').test(program);
    const firstPageUrl = `?page=1&keyWord=${keyWord}&start=${startDate}&end=${endDate}`;

    try {
        const whereClause = {
            [Op.or]: [
                { email: { [Op.substring]: keyWord } },
            ]
        };

        if (startDate && endDate) {
            whereClause.fromDate = {
                [Op.between]: [startDate.toISOString(), endDate.toISOString()]
            };
        }

        if (status && regexStatusNumber) {
            whereClause.status = status;
        }

        let totalItems;
        let lists;

        if (req.user.departments === "phòng giám đốc") {
            totalItems = await db.dateOffs.count({ where: whereClause });
            lists = await db.dateOffs.findAll({
                where: whereClause,
                limit: itemPerPage,
                offset: offset
            });
           
        } else {
            totalItems = await db.dateOffs.count({ where: { id: req.user.userId } });
            
            lists = await db.dateOffs.findAll({
                where: { userId: req.user.userId },
                limit: itemPerPage,
                offset: offset
            });
        }

        const totalPages = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
            let url = `?page=${i}&keyWord=${keyWord}&start=${startDate}&end=${endDate}`;
            if (status) url += `&status=${status}`;
            if (program) url += `&program=${program}`;
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
            keyWord: keyWord,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemPerPage),
            startDate: startDate,
            endDate: endDate,
            status: status,
            message: req.flash('message'),
            keyWord: keyWord,
            program: program,
            totalItems: totalItems,
            totalPages: totalPages,
            firstPageUrl: firstPageUrl
        };

        return res.render('../views/date-off/show.handlebars', data);
    } catch (error) {
        return res.json(error);
    }
};



/**
 * 
 * @param {*} req 
 * @param {view} res 
 */
let create = async (req, res) => {
    let data = {
        messageErr: req.flash('messageErr'),
        message: req.flash('message'),

    }
    res.render("../views/date-off/create.handlebars", { data })
}
/**
 * 
 * @param {name,phone,sex,dob,nameRelation,email,sex2} req 
 * @param {store} 
 */
let store = async (req, res) => {

    try {
        //let salesId = req.user.departmentsId == 2 ? req.user.userId : req.body.salesId
        // define array and variable
        let dataCreateDateOff = {
            fromDate: new Date(req.body.startDate).toLocaleDateString("vi-VI").replace(/\//g, "-"),
            userId: req.user.userId,
            email: req.user.email,
            toDate: new Date(req.body.endDate).toLocaleDateString("vi-VI").replace(/\//g, "-"),
            status:0,
            note: req.body.notes,
            reason:req.body.reason,
            date:"",
        }
        let lsit = await db.dateOffs.create(dataCreateDateOff)
        req.flash('message', 'đã gửi đơn, vui lòng đợi duyệt');
        res.redirect("/date-off/")
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
    const lists = await db.dateOffs.findOne(
        {
            where: { id: id }
        });
  

    if (lists) {
        let data = {
            id: id,
            lists,
            message: req.flash('message')
        }
        return res.render("../views/date-off/edit.handlebars",  data )
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
    
    let id = req.params.id
    try {
        //let salesId = req.user.departmentsId == 2 ? req.user.userId : req.body.salesId
        // define array and variable
       
        let lists = await db.dateOffs.update(
           { status:req.body.status},
           {
                where:{id:id}
            },
        )
        req.flash('message', 'đã phê duyệt thành công');
        res.redirect("/date-off/")
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
        return res.redirect('back')
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
        return res.redirect("/customer/edit/" + modelId)
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
        return res.redirect('back')
    } catch (error) {
        return res.json(error)
    }
}

let deleteChilds = async (req, res) => {

    let idChildren = req.params.idDelete
    let id = req.body.modelId
    try {
        await db.childrens.destroy(
            { where: { id: idChildren } }
        )
        const count = await db.childrens.count({
            where: {
                customerId: id,
            }
        });
        if (count == 0) {
            await db.childrens.create(
                {
                    customerId: id,
                    name: ""
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
    show, create, store, edit, update, destroy, deleteMedias, deleteLinks, deletePhone, deleteChilds
}


// 