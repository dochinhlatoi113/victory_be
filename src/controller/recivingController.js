let getIndexPage = async (req, res) => {
    let data = {
        user:req.user
    }
    res.render("../views/recivingRoom/index.handlebars",data)
}
let create = (req,res) => {
    res.render("../views/recivingRoom/create.handlebars")
}
module.exports = {
    getIndexPage,create
}
       