
module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const company = { 
            id: req.body.id,
            name_company: req.body.name_company,
            cnpj: req.body.cnpj,
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
            blocked: req.body.blocked,
            photo: req.body.photo
         }

        if(req.params.id) company.id = req.params.id

        
        try {
            existsOrError(company.name_company, 'Razão Social não informado')
            existsOrError(company.cnpj, 'CNPJ não informado')

            if(company.id) {
              await app.db('companys')
                    .update(company)
                    .where({ id: company.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {

                const subcnpj= await app.db('companys')
                .where({ cnpj: company.cnpj })
                notExistsOrError(subcnpj, 'CNPJ já existe.')

                await app.db('companys')
                        .insert(company)
                        .then(_ => res.status(204).send())
                        .catch(err => res.status(500).send(err))
            }

            
         } catch(msg) {
            res.status(400).send(msg)
        }

      
    }

    const setCompany = async (req, res) => {
        if (!req.body.id) {
            return res.status(400).send('Informe a Empresa!')
        }

        const company = await app.db('companys')
            .where({ id: req.body.id })
            .first()

        if (!company) return res.status(400).send('Empresa não encontrada!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: company.id,
            nameCompany: company.name_company,
            fantasyName: company.fantasy_name,
            photo: company.photo,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload
        })
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('companys')
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
        app.db('companys')
            .then(companys => res.json(companys))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('companys')
            .where({id: req.params.id})
            .first()
            .then(company => res.json(company))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById,setCompany }


}
