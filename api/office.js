module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save  = (req, res) => {

        const office = {    
            id: req.body.id,
            name: req.body.name,
            description: req.body.description
     
        }

        if(req.params.id) office.id = req.params.id

        try {
            existsOrError(office.name, 'Nome não informada...')

            if(office.id) {
                app.db('offices')
                    .update(office)
                    .where({ id: office.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                app.db('offices')
                    .insert(office)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        } catch(msg) {
            res.status(400).send(msg)
        }

       
    }

    
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código do Cargo/Função não informado.')

            const suboffice = await app.db('employees')
                .where({ office_id: req.params.id })
            notExistsOrError(suboffice, 'Existe Funcionários cadastrados neste Cargo/Função.')

            const rowsDeleted = await app.db('offices')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Cargo/Função não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('offices')
            .then(offices => res.json(offices))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('offices')
            .where({ id: req.params.id })
            .first()
            .then(office => res.json(office))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }

}
