// src/utils/validation.js
const Joi = require('joi');

// Customer schemas
const addressSchema = Joi.object({
  address: Joi.string().max(255).required(),
  city: Joi.string().max(100).required(),
  state: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
  pincode: Joi.string().max(20).required(),
  is_default_shipping: Joi.boolean().default(false),
  is_default_billing: Joi.boolean().default(false),
});

const tagSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

const noteSchema = Joi.object({
  note: Joi.string().max(1000).required(),
});

const customerSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(150).required(),
  phone: Joi.string().max(20).allow('', null),
  status: Joi.string().valid('active', 'inactive').default('active'),
  // Addresses, tags, notes are handled via separate endpoints
});

// Order schemas
const orderItemSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
  unit_price: Joi.number().precision(2).positive().required(),
});

const orderSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  status: Joi.string().valid('Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded').default('Pending'),
});

// Pagination schema (used for query validation)
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
});

// Generic validator function
function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    const err = new Error(details);
    err.status = 400;
    throw err;
  }
  return value;
}

module.exports = {
  validate,
  schemas: {
    address: addressSchema,
    tag: tagSchema,
    note: noteSchema,
    customer: customerSchema,
    order: orderSchema,
    pagination: paginationSchema,
  },
};
