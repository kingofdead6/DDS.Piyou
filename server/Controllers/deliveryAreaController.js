import asyncHandler from 'express-async-handler';
import DeliveryArea from '../Models/DeliveryArea.js';

export const getDeliveryAreas = asyncHandler(async (req, res) => {
  const areas = await DeliveryArea.find({}).sort({ wilaya: 1, commune: 1 });
  res.json(areas);
});

export const createDeliveryArea = asyncHandler(async (req, res) => {
  const { wilaya, commune, deliveryCompany, store, priceHome, priceDesk } = req.body;

  const exists = await DeliveryArea.findOne({ wilaya, commune, store });
  if (exists) {
    res.status(400);
    throw new Error('This store already has a delivery rule for this area');
  }

  const area = await DeliveryArea.create({
    wilaya,
    commune,
    deliveryCompany,
    store,
    priceHome,
    priceDesk,
  });

  res.status(201).json(area);
});

export const updateDeliveryArea = asyncHandler(async (req, res) => {
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) {
    res.status(404);
    throw new Error('Delivery area not found');
  }

  Object.assign(area, req.body);
  await area.save();

  res.json(area);
});

export const deleteDeliveryArea = asyncHandler(async (req, res) => {
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) {
    res.status(404);
    throw new Error('Delivery area not found');
  }

  await area.remove();
  res.json({ message: 'Delivery area removed' });
});