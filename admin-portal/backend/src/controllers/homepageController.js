exports.getAll = async (req, res) => { res.json({ message: 'Get all homepages' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get homepage ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create homepage' }); };
exports.update = async (req, res) => { res.json({ message: 'Update homepage ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete homepage ' + req.params.id }); };
