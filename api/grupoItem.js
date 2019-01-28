const queries = require('./queries')

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save  = (req, res) => {

        const grupoitem = { ...req.body }

        if(req.params.id) grupoitem.id = req.params.id

        try {
            existsOrError(grupoitem.name, 'Nome não informado')

        } catch(msg) {
            res.status(400).send(msg)
        }

        if(grupoitem.id) {
            app.db('grupoitems')
                .update(grupoitem)
                .where({ id: grupoitem.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('grupoitems')
                .insert(grupoitem)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código do Grupo do Item não informado.')

            const subgrupoitem = await app.db('grupoitems')
                .where({ parentId: req.params.id })
            notExistsOrError(subgrupoitem, 'Grupo do Item possui subGrupo de Item.')

            const rowsDeleted = await app.db('grupoitems')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Grupo do Item não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = grupoitems => {
        const getParent = (grupoitems, parentId) => {
            const parent = grupoitems.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const grupoitemsWithPath = grupoitems.map(grupoitem => {
            let path = grupoitem.name
            let parent = getParent(grupoitems, grupoitem.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(grupoitems, parent.parentId)
            }

            return { ...grupoitem, path }
        })

        grupoitemsWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return grupoitemsWithPath
    }

    const get = (req, res) => {
        app.db('grupoitems')
            .then(grupoitems => res.json(withPath(grupoitems)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('grupoitems')
            .where({ id: req.params.id })
            .first()
            .then(grupoitem => res.json(grupoitem))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (grupoitems, tree) => {
        if(!tree) tree = grupoitems.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(grupoitems, grupoitems.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('grupoitems')
            .then(grupoitems => res.json(toTree(grupoitems)))
            .catch(err => res.status(500).send(err))
    }

    const getAnalit = (req, res) => {
        app.db('grupoitems')
            .where({ sintetico: false})
            .then(grupoitems => res.json(withPath(grupoitems)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree,getAnalit }

}
