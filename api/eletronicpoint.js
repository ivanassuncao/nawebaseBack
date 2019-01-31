const moment = require('moment')

module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const dateNow = new Date()
    this.dateNow = moment(dateNow).format("YYYY-MM-DD")

    const save  = async (req, res) => {

        if(req.body.date) req.body.date = moment(req.body.date).format("YYYY-MM-DD")

        const eletronicpoint = { 
            id: req.body.id,
            date: req.body.date,
            time: req.body.time,
            latitude: req.body.latitude,
            longitide: req.body.longitide,
            employee_id: req.body.employee_id,
            input_point: req.body.input_point,
            comments: req.body.comments
        }

        if(req.params.id) eletronicpoint.id = req.params.id

        try {

            if(eletronicpoint.id) {
              await app.db('electronicpoints')
                    .update(eletronicpoint)
                    .where({ id: eletronicpoint.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {

              await app.db('eletronicpoints')
                    .insert(eletronicpoint)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        } catch(msg) {
            res.status(400).send(msg)
        }

       
    }

    
    const remove = async (req, res) => {
        try {

            const rowsDeleted = await app.db('eletronicpoints')
                .where({ id: req.params.id }).del()
                existsOrError(rowsDeleted, 'Ponto Eletronico não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

   
    const get = async (req, res) => {
       await app.db('eletronicpoints')
            .innerJoin('employee', 'employee.id', 'eletronicpoints.employee_id')
            .orderBy(['name',{column:'date', order:'desc'}])
            .then(eletronicpoints => res.json(eletronicpoints))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
      await  app.db('eletronicpoints')
            .where({ employee_id: req.params.id })
            .orderBy('date', 'desc')
            .then(eletronicpoints => res.json(eletronicpoints))
            .catch(err => res.status(500).send(err))
    }

    const getByIdDate = async (req, res) => {
       await app.db('eletronicpoints')
            .where({ employee_id: req.params.id })
            .andWhere({date: this.dateNow})
            .orderBy('register', 'desc')
            .then(eletronicpoints => res.json(eletronicpoints))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByIdDate }

}
