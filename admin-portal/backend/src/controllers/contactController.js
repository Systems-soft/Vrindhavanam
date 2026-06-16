exports.getAll = async (req, res) => { res.json({ message: 'Get all contacts' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get contact ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create contact' }); };
exports.update = async (req, res) => { res.json({ message: 'Update contact ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete contact ' + req.params.id }); };
