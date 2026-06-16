exports.getAll = async (req, res) => { res.json({ message: 'Get all notifications' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get notification ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create notification' }); };
exports.update = async (req, res) => { res.json({ message: 'Update notification ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete notification ' + req.params.id }); };
