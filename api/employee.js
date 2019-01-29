const moment = require('moment')

module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = async (req, res) => {

        if(req.body.ctps_date) req.body.ctps_date = moment(req.body.ctps_date).format("YYYY-MM-DD")
        if(req.body.rg_date) req.body.rg_date = moment(req.body.rg_date).format("YYYY-MM-DD")
        if(req.body.birth_date) req.body.birth_date = moment(req.body.birth_date).format("YYYY-MM-DD")
        if(req.body.admission_date) req.body.admission_date = moment(req.body.admission_date).format("YYYY-MM-DD")
        if(req.body.date_of_resignation) req.body.date_of_resignation = moment(req.body.date_of_resignation).format("YYYY-MM-DD")
    

        const employee = { 
            id: req.body.id,
            name: req.body.name,
            cpf: req.body.cpf,
            ctps: req.body.ctps,
            ctps_date: req.body.ctps_date,
            rg: req.body.rg,
            rg_date: req.body.rg_date,
            birth_date: req.body.birth_date,
            office_id: req.body.office_id,
            registration: req.body.registration,
            company_id: req.body.company_id,
            email: req.body.email,
            adress: req.body.adress,
            number: req.body.number,
            complement: req.body.complement,
            neighborhood: req.body.neighborhood,
            zip_code: req.body.zip_code,
            city_id: req.body.city_id,
            state_id: req.body.state_id,
            telephone: req.body.telephone,
            blocked: req.body.blocked,
            photo: req.body.photo,
            admission_date: req.body.admission_date,
            date_of_resignation: req.body.date_of_resignation,
            user_id: req.body.user_id
         }

        if(req.params.id) employee.id = req.params.id

        
        try {
            existsOrError(employee.name, 'Nome não informado')
            existsOrError(employee.cpf, 'CPF não informado')

            
        if(employee.id) {
            await app.db('employees')
                    .update(employee)
                    .where({ id: employee.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
        } else {
            await app.db('employees')
                    .insert(employee)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
        }

         } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('employees')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Funcinário não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('employees')
          //  .then(employ => tabEmployee[{employ}])
            .then(employees => res.json(employees))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('employees')
            .where({id: req.params.id})
            .first()
            .then(employee => res.json(employee))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }


}
