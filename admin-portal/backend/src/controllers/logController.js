exports.getAll = async (req, res) => { res.json({ message: 'Get all logs' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get log ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create log' }); };
exports.update = async (req, res) => { res.json({ message: 'Update log ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete log ' + req.params.id }); };
