const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const passwordChange = async(req,res)=>{
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        try {

            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')

            user.password = encryptPassword(user.password)
            delete user.confirmPassword
    
            if(user.id) {
               await app.db('users')
                        .update({password: user.password})
                        .where({ id: user.id })
                        .then(_ => res.status(204).send())
                        .catch(err => res.status(500).send(err))
            }      

        } catch(msg) {
            return res.status(400).send(msg)
        }

       
    }

    const blocked = async(req,res)=>{
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        if(user.id) {
           await app.db('users')
                    .update({blocked: 1})
                    .where({ id: user.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
        } 
    }

    
    const unBlocked = async(req,res)=>{
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        if(user.id) {
           await app.db('users')
                    .update({blocked: 0})
                    .where({ id: user.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
        } 
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
          //  existsOrError(user.password, 'Senha não informada')
          //  existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }

            if(user.id) {
               await app.db('users')
                    .update(user)
                    .where({ id: user.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                
                user.password = encryptPassword(user.password)
                delete user.confirmPassword
        
              await  app.db('users')
                        .insert(user)
                        .then(_ => res.status(204).send())
                        .catch(err => res.status(500).send(err))
            }

        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin','super','photo','blocked')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin','super','photo','blocked')
            .where({id: req.params.id})
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            /*
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')
            */

           const subEmployee = await app.db('employees')
            .where({ user_id: req.params.id })
            notExistsOrError(subEmployee, 'Existe Funcionários cadastrados neste Usuário.')

            const rowsUpdated = await app.db('users')
                .update({blocked: 1})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove, passwordChange, blocked, unBlocked }
}