exports.getAll = async (req, res) => { res.json({ message: 'Get all medias' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get media ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create media' }); };
exports.update = async (req, res) => { res.json({ message: 'Update media ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete media ' + req.params.id }); };
