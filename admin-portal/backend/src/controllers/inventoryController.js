exports.getAll = async (req, res) => { res.json({ message: 'Get all inventorys' }); };
exports.getById = async (req, res) => { res.json({ message: 'Get inventory ' + req.params.id }); };
exports.create = async (req, res) => { res.json({ message: 'Create inventory' }); };
exports.update = async (req, res) => { res.json({ message: 'Update inventory ' + req.params.id }); };
exports.remove = async (req, res) => { res.json({ message: 'Delete inventory ' + req.params.id }); };
