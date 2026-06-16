exports.getAll = async (req, res) => { res.json({ message: 'Get all variants' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get variant ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create variant' }); };
exports.update = async (req, res) => { res.json({ message: 'Update variant ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete variant ' + req.params.id }); };
