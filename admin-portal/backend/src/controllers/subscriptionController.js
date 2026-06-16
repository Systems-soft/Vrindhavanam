exports.getAll = async (req, res) => { res.json({ message: 'Get all subscriptions' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get subscription ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create subscription' }); };
exports.update = async (req, res) => { res.json({ message: 'Update subscription ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete subscription ' + req.params.id }); };
