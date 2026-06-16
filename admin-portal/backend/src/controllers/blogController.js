exports.getAll = async (req, res) => { res.json({ message: 'Get all blogs' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get blog ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create blog' }); };
exports.update = async (req, res) => { res.json({ message: 'Update blog ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete blog ' + req.params.id }); };
