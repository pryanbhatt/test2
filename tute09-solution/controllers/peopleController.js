const Author = require('../models/author')

const getAllPeopleData = async (req, res, next) => {
    try {
        const authors = await Author.find().lean()
        return res.render('allData', { data: authors })
    } catch (err) {
        return next(err)
    }
}

const getDataById = async(req, res, next) => {
    try {
        const author = await Author.findById(req.params.author_id).lean()
        if (!author) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: author })
    } catch (err) {
        return next(err)
    }
}

const insertData = async (req, res, next) => {
    const { first_name, last_name } = req.body
    try {
        const author = await Author.create({ first_name, last_name })
        return res.redirect(`/people/${author._id}`)
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPeopleData,
    getDataById,
    insertData,
}
