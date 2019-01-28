module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const unitmeasure = {  
            id: req.body.id,
            name: req.body.name,
            initials: req.body.initials
         }

        if(req.params.id) unitmeasure.id = req.params.id

        try {
            existsOrError(unitmeasure.name, 'Nome não informado...')
            existsOrError(unitmeasure.initials, 'Sigla não informada...')

             
        if(unitmeasure.id) {
            app.db('unitmeasures')
                .update(unitmeasure)
                .where({ id: unitmeasure.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('unitmeasures')
                .insert(unitmeasure)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
        
        } catch(msg) {
            res.status(400).send(msg)
        }

       

    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('unitmeasures')
                .where({ id: req.params.id }).del()           
            
            try {
                existsOrError(rowsDeleted, 'Unidade de medida não foi encontrada.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('unitmeasures')
            .then(unitmeasures => res.json(unitmeasures))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('unitmeasures')
            .where({id: req.params.id})
            .first()
            .then(unitmeasure => res.json(unitmeasure))
            .catch(err => res.status(500).send(err))
    }


    return { save, remove, get, getById}

}