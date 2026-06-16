const fs = require('fs');
const path = require('path');

const modules = [
  'variant', 'inventory', 'harvest', 'subscription', 'marketing', 'blog', 'homepage', 'contact', 'media', 'notification', 'log', 'ai', 'auth'
];

const routesDir = path.join(__dirname, 'src', 'routes');
const controllersDir = path.join(__dirname, 'src', 'controllers');

if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });

modules.forEach(mod => {
  const routeContent = `const express = require('express');\nconst router = express.Router();\nconst controller = require('../controllers/${mod}Controller');\n\nrouter.get('/', controller.getAll);\nrouter.get('/:id', controller.getById);\nrouter.post('/', controller.create);\nrouter.put('/:id', controller.update);\nrouter.delete('/:id', controller.remove);\n\nmodule.exports = router;\n`;
  const controllerContent = `exports.getAll = async (req, res) => { res.json({ message: 'Get all ${mod}s' }); };\nexports.getById = async (req, res) => { res.json({ message: 'Get ${mod} ' + req.params.id }); };\nexports.create = async (req, res) => { res.json({ message: 'Create ${mod}' }); };\nexports.update = async (req, res) => { res.json({ message: 'Update ${mod} ' + req.params.id }); };\nexports.remove = async (req, res) => { res.json({ message: 'Delete ${mod} ' + req.params.id }); };\n`;

  const routePath = path.join(routesDir, `${mod}Routes.js`);
  if (!fs.existsSync(routePath)) fs.writeFileSync(routePath, routeContent);
  
  const controllerPath = path.join(controllersDir, `${mod}Controller.js`);
  if (!fs.existsSync(controllerPath)) fs.writeFileSync(controllerPath, controllerContent);
});

console.log('Bootstrapped routes and controllers');
