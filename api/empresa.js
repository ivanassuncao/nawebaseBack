const queries = require('./queries')

module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const empresa = { ...req.body }

        if(req.params.id) empresa.id = req.params.id

        
        try {
            existsOrError(empresa.razaosocial, 'Razão Social não informado')
            existsOrError(empresa.cnpj, 'CNPJ não informado')
         } catch(msg) {
            res.status(400).send(msg)
        }

        if(empresa.id) {
            app.db('empresas')
                .update(empresa)
                .where({ id: empresa.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('empresas')
                .insert(empresa)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const setEmpresa = async (req, res) => {
        if (!req.body.id) {
            return res.status(400).send('Informe a empresa!')
        }

        const empresa = await app.db('empresas')
            .where({ id: req.body.id })
            .first()

        if (!empresa) return res.status(400).send('Empresa não encontrada!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: empresa.id,
            razaosocial: empresa.razaosocial,
            caminhoImagem: empresa.caminhoImagem,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload
        })
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('empresas')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Empresa não foi encontrada.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('empresas')
            .then(empresas => res.json(empresas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('empresas')
            .where({id: req.params.id})
            .first()
            .then(empresa => res.json(empresa))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById,setEmpresa }

}
