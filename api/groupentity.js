module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const save  = async (req, res) => {

        const groupentity = { 
            id: req.body.id,
            name: req.body.name,
            internal_code_group_entity: req.body.internal_code_group_entity,
            sale: req.body.sale,
            purchase: req.body.purchase,
            service: req.body.service,
            synthetic: req.body.synthetic,
            blocked: req.body.blocked
        }

        if(req.params.id) groupentity.id = req.params.id

        try {

            existsOrError(groupentity.name, 'Nome não informado')
            existsOrError(groupentity.internal_code_group_entity, 'Código não informado')

            if(groupentity.id) {
              await app.db('groupentitys')
                    .update(groupentity)
                    .where({ id: groupentity.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {

                const subInternal= await app.db('groupentitys')
                .where({ internal_code_group_entity: groupentity.internal_code_group_entity })
                notExistsOrError(subInternal, 'Código Interno já existe.')

              await app.db('groupentitys')
                    .insert(groupentity)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        } catch(msg) {
            res.status(400).send(msg)
        }

       
    }

    
    const remove = async (req, res) => {
        try {

            const subEmployee = await app.db('entitys')
            .where({ group_entity_id: req.params.id })
            notExistsOrError(subEmployee, 'Existe Clientes/Fornecedores cadastrados neste Grupo de Cliente/Fornecedor.')

            existsOrError(req.params.id, 'Código do Grupo de Cliente/Fornecedor não informado.')

            const rowsDeleted = await app.db('groupentitys')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Grupo de Cliente/Fornecedor não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

   
    const get = (req, res) => {
        app.db('groupentitys')
            .orderBy('internal_code_group_entity')
            .then(groupentitys => res.json(groupentitys))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('groupentitys')
            .where({ id: req.params.id })
            .first()
            .then(groupentity => res.json(groupentity))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }

}
