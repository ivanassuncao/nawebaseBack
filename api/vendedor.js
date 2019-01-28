
module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = async (req, res) => {
        const vendedor = { ...req.body }
        if(req.params.id) vendedor.id = req.params.id

        try {
            existsOrError(vendedor.nome, 'Nome não informado')
            existsOrError(vendedor.email, 'E-mail não informado')
            existsOrError(vendedor.matricula, 'Matricula não informada')

            const vendedorFromDB = await app.db('vendedores')
                .where({ matricula: vendedor.matricula }).first()
            if(!vendedor.id) {
                notExistsOrError(vendedorFromDB, 'Matricula já cadastrado para outro vendedor')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        
        if(vendedor.id) {
            app.db('vendedores')
                .update(vendedor)
                .where({ id: vendedor.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('vendedores')
                .insert(vendedor)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('vendedores')
            .select('id', 'nome', 'email','matricula','porcComissao','foto', 'ativo')
            .then(vendedores => res.json(vendedores))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('vendedores')
            .select('id', 'nome', 'email','matricula','porcComissao','foto', 'ativo')
            .where({id: req.params.id})
            .first()
            .then(vendedor => res.json(vendedor))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {

            const rowsDeleted = await app.db('vendedores')
            .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Vendedor não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}