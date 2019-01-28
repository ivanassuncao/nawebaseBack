module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = async (req, res) => {
        const funcionario = { ...req.body }

        if(req.params.id) funcionario.id = req.params.id

        try {
            existsOrError(funcionario.nome, 'Nome não informado')
            existsOrError(funcionario.email, 'E-mail não informado')
            existsOrError(funcionario.matricula, 'Matricula não informada')

            const funcionarioFromDB = await app.db('funcionarios')
                .where({ matricula: funcionario.matricula }).first()
            if(!funcionario.id) {
                notExistsOrError(funcionarioFromDB, 'Matricula já cadastrada para outro funcionário')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        
        if(funcionario.id) {
            app.db('funcionarios')
                .update(funcionario)
                .where({ id: funcionario.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('funcionarios')
                .insert(funcionario)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const get = (req, res) => {
        app.db('funcionarios')
            .then(funcionarios => res.json(funcionarios))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('funcionarios')
            .where({id: req.params.id})
            .first()
            .then(funcionario => res.json(funcionario))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {

            const rowsDeleted = await app.db('funcionarios')
            .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Funcionário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }

}
