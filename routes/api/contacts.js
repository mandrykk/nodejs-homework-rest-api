const express = require('express');

const router = express.Router();

const contactsOperations = require('../../service/contacts');

const Joi = require('joi');
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contactsOperations.listContacts();
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    });
  } catch (err) {next(err)}
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsOperations.getContactById(contactId);
    
    if (!result) {
      const error = new Error(`Contact ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: result
      }
    });
  } catch (err) {next(err)}
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      error.message = 'missing required name field';
      throw error;
    }
    const { name, email, phone } = req.body;
    const result = await contactsOperations.addContact(name, email, phone);
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        result,
      },
    });
  } catch (err) {next(err)}
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsOperations.removeContact(contactId);
      if (!result) {
      const error = new Error(`Contact ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
      data: {
        result,
      },
    });
  } catch (err) {next(err)}
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      error.message = 'missing fields';
      throw error;
    }

    const { contactId } = req.params;
    const result = await contactsOperations.updateContact(contactId, req.body);
    if (!result) {
      const error = new Error(`Contact ${contactId} not found`)
      error.status = 404;
      throw error;
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contact updated',
      data: {
        result,
      },
    });
  } catch (err) {next(err)}
})

module.exports = router
