module.exports = function(app) {
    app.get('/',
    function(req, res, next) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);
        equipamentosDAO.listaVencidos(function(erros, resultados) {
          req.equipamentos1 = resultados;
          return next();
        });
        connection.end();
    },
    function(req, res, next) {
        var connection = app.infra.connectionFactory();
        var equipamentosDAO = new app.infra.EquipamentosDAO(connection);
        equipamentosDAO.listaProximoMes(function(erros, resultados) {
          req.equipamentos2 = resultados;
          return next();
        });
        connection.end();
    },
    function(req, res) {
    res.render('home/index',{
        equipamentos1: req.equipamentos1,
        equipamentos2: req.equipamentos2});
    }
  );
}
