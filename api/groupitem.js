module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const save  = async (req, res) => {

        const groupitem = { 
            id: req.body.id,
            name: req.body.name,
            internal_code_group_item: req.body.internal_code_group_item,
            item_sale: req.body.item_sale,
            item_purchase: req.body.item_purchase,
            item_service: req.body.item_service,
            cnae: req.body.cnae,
            synthetic: req.body.synthetic,
            blocked: req.body.blocked
        }

        if(req.params.id) groupitem.id = req.params.id

        try {
            existsOrError(groupitem.name, 'Nome não informado')
            existsOrError(groupitem.internal_code_group_item, 'Código não informado')

         

            if(groupitem.id) {
                await  app.db('groupitems')
                        .update(groupitem)
                        .where({ id: groupitem.id })
                        .then(_ => res.status(204).send())
                        .catch(err => res.status(500).send(err))
            } else {

                const subInternal= await app.db('groupitems')
                .where({ internal_code_group_item: groupitem.internal_code_group_item })
                notExistsOrError(subInternal, 'Código Interno já existe.')

                await app.db('groupitems')
                    .insert(groupitem)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        } catch(msg) {
            res.status(400).send(msg)
        }

      
    }

    
    const remove = async (req, res) => {
        try {

            const subEmployee = await app.db('items')
            .where({ group_item_id: req.params.id })
            notExistsOrError(subEmployee, 'Existe Items cadastrados neste Grupo de Items.')

            existsOrError(req.params.id, 'Código do Grupo do Item não informado.')

            const rowsDeleted = await app.db('groupitems')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Grupo do Item não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

   
    const get = (req, res) => {
        app.db('groupitems')
            .orderBy('internal_code_group_item')
            .then(groupitems => res.json(groupitems))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('groupitems')
            .where({ id: req.params.id })
            .first()
            .then(groupitem => res.json(groupitem))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }

}
