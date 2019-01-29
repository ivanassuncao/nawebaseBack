module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const item = {  
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            internal_code: req.body.internal_code,
            ncm: req.body.ncm,
            cest: req.body.cest,
            group_item_id: req.body.group_item_id,
            unit_measure_id: req.body.unit_measure_id,
            stock: req.body.stock,
            blocked: req.body.blocked,
            photo: req.body.photo
         }

        if(req.params.id) item.id = req.params.id

        try {
            existsOrError(item.name, 'Nome não informado...')

             
        if(item.id) {
            await app.db('items')
                .update(item)
                .where({ id: item.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {

            const subname= await app.db('items')
            .where({ name: item.name })
            notExistsOrError(subname, 'Nome já existe.')

            await app.db('items')
                .insert(item)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

        } catch(msg) {
            res.status(400).send(msg)
        }

       

    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('items')
                .where({ id: req.params.id }).del()           
            
            try {
                existsOrError(rowsDeleted, 'Item não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('items')
            .then(items => res.json(items))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('items')
            .where({id: req.params.id})
            .first()
            .then(item => res.json(item))
            .catch(err => res.status(500).send(err))
    }

    const getByGroupItem = async (req, res) => {

        app.db('items')
            .where({group_item_id: req.params.id})
            .orderBy('name')
            .then(items => res.json(items))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById,getByGroupItem}

}