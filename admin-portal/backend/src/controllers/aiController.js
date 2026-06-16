exports.getAll = async (req, res) => { res.json({ message: 'Get all ais' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get ai ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create ai' }); };
exports.update = async (req, res) => { res.json({ message: 'Update ai ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete ai ' + req.params.id }); };
