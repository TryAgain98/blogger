const db = require("../models");
const Post = db.post;
const Category = db.post_category;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");
const { post } = require("../models");

exports.findAll = (req, res) => {
    const search = req.query.search;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    var condition = search ? {
        [Op.or]: [
            { name: { [Op.like]: '%' + search + '%' } },
            { postCategoryId: search },
        ]
    } : null

    Post.findAndCountAll({
        include: [
            {
                model: db.user

            },
            {
                model: db.post_category
            },
            {
                model: db.post_like
            }
        ],
        where: condition, limit, offset,
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response)
        })
        .catch(err => {
            messageError(res, err)
        })
}

exports.create = async (req, res) => {
    let isHot = req.body.isHot
    let postCategoryId = req.body.postCategoryId
    if (isHot) {
        let post = {
            isHot: false
        }
        await Post.update(post, {
            where: {
                [Op.and]: [
                    { isHot: true },
                    { postCategoryId: postCategoryId }
                ]
            }
        })
    }
    try {
        const data = await Post.create(req.body)
        res.send(data);
    }
    catch (err) {
        messageError(res, err)
    };

}

exports.findIsHot = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    Post.findAndCountAll({
        include: [
            {
                model: db.post_category
            }
        ],
        where: { isHot: true }
    })
        .then(data => {
            const createdDate = []
            if (!!data) {
                data.rows.map((d, index) => createdDate.push(d.created_at))
            }
            const isHotDate = new Date(Math.max.apply(null, createdDate))

            Post.findOne({
                include:
                    [{
                        model: db.post_category
                    }],
                where: {
                    [Op.and]: [
                        { isHot: true },
                        { created_at: isHotDate }
                    ]
                }
            })
                .then(dataHot => {
                    const response = getPagingData(data, page, limit)
                    const responseNew = {
                        hotEspecially: dataHot,
                        hot: response
                    }
                    res.send(responseNew)
                })


        })
        .catch(err => {
            messageError(res, err)
        })
}

exports.findInCategoryId = (req, res) => {

    Category.findAll({
        include: [
            {
                model: db.post,
            },
        ],
    })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            messageError(res, err)
        })

}

exports.update = async (req, res) => {
    const id = req.params.id;
    const isHot = req.body.isHot
    const postCategoryId = req.body.postCategoryId
    if (isHot) {
        const post = {
            isHot: false
        }

        await Post.update(post, {
            where: {
                [Op.and]: [
                    { isHot: true },
                    { postCategoryId: postCategoryId }
                ]
            }
        })
    }
    Post.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: " Post was updated successfully. "
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id =" + id
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id;
    Post.findOne({
        include: [
            {
                model: db.post_like

            },
            {
                model: db.user
            },
            {
                model: db.post_category
            }

        ],
        where: { id: id }
    })
        .then(data => {
            if (data.length == 0) {
                res.send({
                    message: " Can not find Post with id =" + id
                })
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrievinig Post with id =" + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Post.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: " Post was deleted successdully!"
                });
            }
            else {
                res.send({
                    message: `Can not delete Post with id=${id}. Maybe Post was not found!`
                });
            }
        })
        .catch(err => {
            res.send(500).send({
                message: "Error delete Post with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Post.destroy({
        where: {},
        truncate: false
    })
        .then(num => {
            res.send({ message: `${num} Post were deleted successfully!` });
        })
        .catch(err => {
            messageError(res, err)
        })
}