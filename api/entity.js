
module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const entity = { 
            id: req.body.id,
            name_entity: req.body.name_entity,
            cnpj_cpf: req.body.cnpj_cpf,
            insc_state: req.body.insc_state,
            insc_municipal: req.body.insc_municipal,
            small_name: req.body.small_name,
            insc_joint: req.body.insc_joint,
            email: req.body.email,
            fantasy_name: req.body.fantasy_name,
            adress: req.body.adress,
            number: req.body.number,
            complement: req.body.complement,
            neighborhood: req.body.neighborhood,
            zip_code: req.body.zip_code,
            city_id: req.body.city_id,
            state_id: req.body.state_id,
            telephone: req.body.telephone,
            cellphone: req.body.cellphone,
            physical_person: req.body.physical_person,
            group_entity_id: req.body.group_entity_id,
            blocked: req.body.blocked,
            photo: req.body.photo
         }

        if(req.params.id) entity.id = req.params.id

        
        try {
            existsOrError(entity.name_entity, 'Nome não informado')
            existsOrError(entity.cnpj_cpf, 'CPF/CNPJ não informado')

            if(entity.id) {
                app.db('entitys')
                    .update(entity)
                    .where({ id: entity.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                app.db('entitys')
                    .insert(entity)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

            
         } catch(msg) {
            res.status(400).send(msg)
        }

      
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('entitys')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Cliente/Fornecedor não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('entitys')
            .then(entitys => res.json(entitys))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('entitys')
            .where({id: req.params.id})
            .first()
            .then(entity => res.json(entity))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById,setentity }


}
