const admin = require('./admin')
const supervisor = require('./supervisor')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/setCompany', app.api.company.setCompany)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    app.put('/passwordChange/:id',app.api.user.passwordChange)
    app.get('/states',app.api.util.getStates)
    app.get('/citys/:id',app.api.util.getCitys)
    app.put('/blocked/:id',app.api.user.blocked)
    app.put('/unBlocked/:id',app.api.user.unBlocked)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))
     
    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.category.get))
        .post(admin(app.api.category.save))

    // Cuidado com ordem! Tem que vir antes de /categories/:id
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

   

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)


    // Group Items
    app.route('/groupitems')
        .all(app.config.passport.authenticate())
        .get(app.api.groupitem.get)
        .post(admin(app.api.groupitem.save))

    app.route('/groupitems/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.groupitem.getById)
        .put(admin(app.api.groupitem.save))
        .delete(admin(app.api.groupitem.remove))    

    // Group Items
    app.route('/groupentitys')
        .all(app.config.passport.authenticate())
        .get(app.api.groupentity.get)
        .post(admin(app.api.groupentity.save))

    app.route('/groupentitys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.groupentity.getById)
        .put(admin(app.api.groupentity.save))
        .delete(admin(app.api.groupentity.remove))    

    // Unit Measures
    app.route('/unitmeasures')
      .all(app.config.passport.authenticate())
      .get(app.api.unitmeasure.get)
      .post(admin(app.api.unitmeasure.save))

    app.route('/unitmeasures/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.unitmeasure.getById)
      .put(admin(app.api.unitmeasure.save))
      .delete(admin(app.api.unitmeasure.remove))        

    // Companys    

    app.route('/companys')
        .all(app.config.passport.authenticate())
        .get(app.api.company.get)
        .post(admin(app.api.company.save))

    app.route('/companys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.company.getById)
        .put(admin(app.api.company.save))
        .delete(admin(app.api.company.remove))  

    // Employees    

       app.route('/employees')
       .all(app.config.passport.authenticate())
       .get(app.api.employee.get)
       .post(admin(app.api.employee.save))

   app.route('/employees/:id')
       .all(app.config.passport.authenticate())
       .get(app.api.employee.getById)
       .put(admin(app.api.employee.save))
       .delete(admin(app.api.employee.remove))      

    // Office

    app.route('/offices')
        .all(app.config.passport.authenticate())
        .get(app.api.office.get)
        .post(admin(app.api.office.save))

    app.route('/offices/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.office.getById)
        .put(admin(app.api.office.save))
        .delete(admin(app.api.office.remove))  


    // Plano de Contas    

       app.route('/planocontas')
       .all(app.config.passport.authenticate())
       .get(app.api.planoconta.get)
       .post(admin(app.api.planoconta.save))

   app.route('/planocontas/:id')
       .all(app.config.passport.authenticate())
       .get(app.api.planoconta.getById)
       .put(admin(app.api.planoconta.save))
       .delete(admin(app.api.planoconta.remove))       

    // Items    

    app.route('/items')
       .all(app.config.passport.authenticate())
       .get(admin(app.api.item.get))
       .post(admin(app.api.item.save))

    app.route('/items/:id')
       .all(app.config.passport.authenticate())
       .get(app.api.item.getById)
       .put(admin(app.api.item.save))
       .delete(admin(app.api.item.remove))      

    app.route('/groupitems/:id/items')
       .all(app.config.passport.authenticate())
       .get(app.api.item.getByGroupItem)

   // Entity    

   app.route('/entitys')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.entity.get))
        .post(admin(app.api.entity.save))

    app.route('/entitys/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.entity.getById)
        .put(admin(app.api.entity.save))
        .delete(admin(app.api.entity.remove))      

    app.route('/groupentitys/:id/entitys')
        .all(app.config.passport.authenticate())
        .get(app.api.entity.getByGroupEntity)  


      // Vendedor 

    app.route('/vendedores')
       .all(app.config.passport.authenticate())
       .get(app.api.vendedor.get)
       .post(admin(app.api.vendedor.save))

    app.route('/vendedores/:id')
       .all(app.config.passport.authenticate())
       .get(app.api.vendedor.getById)
       .put(admin(app.api.vendedor.save))
       .delete(admin(app.api.vendedor.remove)) 

    // Funcionario

    app.route('/funcionarios')
        .all(app.config.passport.authenticate())
        .get(app.api.funcionario.get)
        .post(admin(app.api.funcionario.save))

    app.route('/funcionarios/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.funcionario.getById)
        .put(admin(app.api.funcionario.save))
        .delete(admin(app.api.funcionario.remove))    

      // Cliente 

    app.route('/clientes')
      .all(app.config.passport.authenticate())
      .get(app.api.cliente.get)
      .post(admin(app.api.cliente.save))

   app.route('/clientes/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.cliente.getById)
      .put(admin(app.api.cliente.save))
      .delete(admin(app.api.cliente.remove))    
   
   app.route('/clientes/:id/clientesdependentes') 
    .all(app.config.passport.authenticate())
    .get(app.api.cliente.getByIdDependente)
    .post(admin(app.api.cliente.saveDependente))
    .delete(admin(app.api.cliente.removeDependente))
}