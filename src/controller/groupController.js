let show = async (req, res) => {   
    res.render("../views/group/show.handlebars")
}
let create = (req,res) => {
    res.render("../views/recivingRoom/create.handlebars")
}
module.exports = {
    show,create
}
       