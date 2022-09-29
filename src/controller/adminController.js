let getIndexPage = async (req, res) => {
    res.render("../views/index.handlebars")
}

module.exports = {
    getIndexPage
}