exports.getAll = async (req, res) => { res.json({ message: 'Get all marketings' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get marketing ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create marketing' }); };
exports.update = async (req, res) => { res.json({ message: 'Update marketing ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete marketing ' + req.params.id }); };
