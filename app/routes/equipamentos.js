module.exports = function(app) {

    var listaEquipamentos = function(req, res, next) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);

        equipamentosDAO.lista(function(err, results) {
            if(err) {
                return next(err);
            }
            res.format({
                html: function() {
                    res.render('equipamentos/lista', {equipamentos:results});
                },
                json: function() {
                    res.json(results);
                }
            });
        });

        connection.end();
    }

    app.get('/equipamentos', listaEquipamentos);

    app.get('/equipamentos/json', function(req, res) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);

        equipamentosDAO.lista(function(err, results) {
            res.json(results);
        });

        connection.end();
    });

    app.get('/equipamentos/form', function(req, res) {
        res.render('equipamentos/form', {errosValidacao:{}, equipamentos:{}});
    });

    app.post('/equipamentos/form', function(req, res) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);
        equipamentosDAO.listaUnico(req.body.id, function(err, results) {
            res.render('equipamentos/form', {errosValidacao:{}, equipamentos:results});
        });
    });

    app.post('/equipamentos/form/remove', function(req, res) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);
        equipamentosDAO.apaga(req.body.id, function(err, results) {
            res.redirect('/equipamentos');
        });
    });

    app.post('/equipamentos', function(req, res) {
        var equipamento = req.body;
        req.assert('nome', 'Nome é obrigatório').notEmpty();

        var erros = req.validationErrors();
        if(erros) {
            res.format({
                html: function() {
                    res.status(400).render('equipamentos/form', {errosValidacao:erros, equipamentos:equipamento});
                },
                json: function() {
                    res.status(400).json(erros);
                }
            });

            return;
        }

        //arrumando as data do formato brasileiro para format mysql
        equipamento.dtmanut = equipamento.dtmanut.split('/').reverse().join('/');
        equipamento.dtult = equipamento.dtult.split('/').reverse().join('/');

        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);

        //verificar se é uma edição ou um novo registro (salvamento)
        if (equipamento.tipo == 'salvar') {
          delete equipamento.tipo;
          delete equipamento.id;
          equipamentosDAO.salva(equipamento, function(err, results) {
            if (err != null) {
                res.redirect('/errors');
            } else {
              res.redirect('/equipamentos');
            };
          });
        } else {
          delete equipamento.tipo;
          equipamentosDAO.edita(equipamento, equipamento.id, function(err, results) {
            if (err != null) {
                res.redirect('/errors');
            } else {
              res.redirect('/equipamentos');
            };
          });
        }

        connection.end();
    });
}
