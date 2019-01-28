module.exports = app => {

    const getStates = (req, res) => {
        app.db('states')
            .then(states => res.json(states))
            .catch(err => res.status(500).send(err))
    }

    const getCitys = (req, res) => {
        app.db('citys')
            .where({state_id: req.params.id})
            .then(citys => res.json(citys))
            .catch(err => res.status(500).send(err))
    }

    return { getStates,getCitys }
}