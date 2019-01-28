const queries = require('./queries')

module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const cliente = { ...req.body }

        if(req.params.id) cliente.id = req.params.id

        try {
            existsOrError(cliente.nome, 'Nome não informado')
            existsOrError(cliente.cpf, 'CPF não informado')
         } catch(msg) {
            res.status(400).send(msg)
        }

        if(cliente.id) {
            app.db('clientes')
                .update(cliente)
                .where({ id: cliente.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('clientes')
                .insert(cliente)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const saveDependente = (req, res) => {

        const clientesdependente = {
            id: req.body.id,
            clienteId: req.params.id
        }
    
        try {
            existsOrError(clientesdependente.id, 'Cliente não informado')
         } catch(msg) {
            res.status(400).send(msg)
        }

        app.db('clientesdependentes')
        .insert(clientesdependente)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))

    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('clientes')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Cliente não foi encontrada.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const removeDependente = async (req, res) => {
        try {
            const clientesdependente = {
                id: req.body.id,
                clienteId:  req.body.clienteId
            }
            const rowsDeleted = await app.db('clientesdependentes')
                .where({ clienteId: clientesdependente.clienteId })
                .andWhere({ id: clientesdependente.id})
                .del()
            
            try {
                existsOrError(rowsDeleted, 'Cliente não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('clientes')
            .then(clientes => res.json(clientes))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('clientes')
            .where({id: req.params.id})
            .first()
            .then(cliente => res.json(cliente))
            .catch(err => res.status(500).send(err))
    }

    const getByIdDependente = (req, res) => {
        if(req.params.id) 
        {
        app.db({a: 'clientesdependentes', u: 'clientes'})
            .select('a.id','a.clienteId', 'u.nome', 'u.cpf')
            .whereRaw('?? = ??', ['u.id', 'a.id'])
            .where({clienteId: req.params.id})
            .then(clientesdependentes => res.json(clientesdependentes))
            .catch(err => res.status(500).send(err))
        }    
    }

    return { save, remove, get, getById,getByIdDependente,saveDependente,removeDependente }

}
