exports.getAll = async (req, res) => { res.json({ message: 'Get all harvests' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get harvest ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create harvest' }); };
exports.update = async (req, res) => { res.json({ message: 'Update harvest ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete harvest ' + req.params.id }); };
