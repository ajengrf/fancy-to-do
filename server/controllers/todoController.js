const { Todo } = require('../models')
const createError = require('http-errors')

class TodoController {
  static findAll(req, res, next) {
    Todo
      .findAll({
        where: {
          UserId: req.user.id
        },
        order: [['id', 'ASC']]
      })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        next(err)
      })
  }

  static create(req, res, next) {

    let todo = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      UserId: req.user.id
    }

    console.log(todo, '< ini todo di create todoController')

    Todo
      .create(todo)
      .then(result => {
        res.status(201).json(result)
        console.log(result, '< result create todo')
      })
      .catch(err => {
        if (err.message) {
          err.status = 400
        }
        next(err)
      })
  }

  static findOne(req, res, next) {
    let id = req.params.id

    Todo
      .findOne({
        where: {
          id: id
          // UserId: req.user.id
        }
      })
      .then(result => {
        if (result) {
          res.status(200).json(result)
        } else {
          //   // let err = {
          //   //   statusCode: '404',
          //   //   message: 'Error 404, command not found!'
          //   // }
          //   // next(err)
          throw createError(404, 'Error 404, command not found!')
        }
        // res.send(result)
      })
      .catch(err => {
        next(err)
        // res.send(err)
      })
  }

  static update(req, res, next) {
    let todo = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      UserId: req.user.id
    }

    let id = req.params.id

    Todo
      .update(todo, {
        where: {
          id: id,
          UserId: todo.UserId
        },
        returning: true
      })
      .then(result => {
        if (result[0] > 0) {
          res.status(200).json(result[1][0])
        } else {
          // let err = {
          //   StatusCode: '400',
          //   message: 'Error 400, command not found!'
          // }
          // next(err)
          throw createError(404, 'Error 404, command not found!')
        }
      })
      .catch(err => {
        // console.log(err)
        // if (err.message) {
        //   err.status = 400
        // }
        // next(err)
        if (err.name === "SequelizeValidationError") {
          next(createError(400, { message: err.message }))
        }
        next(err)

        // res.send(err.message)
        // res.send(err)
      })
  }

  static delete(req, res, next) {
    let id = req.params.id
    let deleted = {}
    Todo
      .findByPk(id)
      .then(result => {
        deleted = result
        return Todo
          .destroy({
            where: {
              id: id,
              UserId: req.user.id
            }
          })

      })
      .then(result => {
        if (result == 1) {
          res.status(200).json(deleted)
        } else {
          // let err = {
          //   StatusCode: '404',
          //   message: 'Error 404, command not found!'
          // }
          // next(err)
          throw (createError(404, 'Error 404, command not found!'))
        }
        // res.send(result)
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = TodoController