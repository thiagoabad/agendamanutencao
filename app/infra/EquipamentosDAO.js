function EquipamentosDAO(connection) {
    this._connection = connection;
}

EquipamentosDAO.prototype.lista = function(callback) {
    this._connection.query('select * from equipamentos', callback);
}

EquipamentosDAO.prototype.listaUnico = function(equipamento, callback) {
    this._connection.query('select * from equipamentos where id=?', equipamento, callback);
}

EquipamentosDAO.prototype.listaVencidos = function(callback) {
    this._connection.query('SELECT * FROM equipamentos WHERE dtmanut <= CURDATE()', callback);
}

EquipamentosDAO.prototype.listaProximoMes = function(callback) {
    this._connection.query('SELECT * FROM equipamentos WHERE dtmanut > NOW() AND NOW() + INTERVAL 1 MONTH', callback);
}

EquipamentosDAO.prototype.salva = function(equipamento, callback) {
    this._connection.query('insert into equipamentos set ?', equipamento, callback);
}

EquipamentosDAO.prototype.edita = function(equipamento, id, callback) {
    this._connection.query('UPDATE equipamentos SET ? where id=?', [equipamento, id], callback);
}

EquipamentosDAO.prototype.apaga = function(id, callback) {
    this._connection.query('DELETE FROM equipamentos WHERE equipamentos.id=?', id, callback);
}

module.exports = function() {
    return EquipamentosDAO;
};
