const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()
        const grupoitemsCount = await app.db('grupoitems').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {},
            { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            grupoitems: grupoitemsCount.count, 
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles
        const changeGrupoitems = !lastStat || stat.grupoitems !== lastStat.grupoitems

        if(changeUsers || changeCategories || changeArticles || changeGrupoitems) {
            stat.save().then(() => console.log('[Stats] Estatíticas atualizadas!'))
        }
    })
}