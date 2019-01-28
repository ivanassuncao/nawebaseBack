module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        
        const planoconta = { ...req.body }

        if(req.params.id) planoconta.id = req.params.id

        try {
            existsOrError(planoconta.contaContabil, 'Conta Contábil não informada')
            existsOrError(planoconta.descricaoContabil, 'Descrição não informada')
            existsOrError(planoconta.naturezacontaContabil, 'Natureza não informada')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(planoconta.id) {
            app.db('planocontas')
                .update(planoconta)
                .where({ id: planoconta.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('planocontas')
                .insert(planoconta)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('planocontas')
                .where({ id: req.params.id }).del()

        try {
                existsOrError(rowsDeleted, 'Plano de Conta não foi encontrada.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('planocontas')
            .then(items => res.json(items))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('planocontas')
            .where({id: req.params.id})
            .first()
            .then(item => res.json(item))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById}


}