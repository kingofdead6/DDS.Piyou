// Controllers/deliveryAreaController.js
import asyncHandler from 'express-async-handler';
import DeliveryArea from '../Models/DeliveryArea.js';
import StoreSettings from '../Models/StoreSettings.js'; // ← ADD THIS LINE!

export const getDeliveryAreas = asyncHandler(async (req, res) => {
  const { store } = req.query;

  if (!store) {
    res.status(400);
    throw new Error("Store name is required");
  }

  // Get or create StoreSettings
  let settings = await StoreSettings.findOne({ storeName: store });
  if (!settings) {
    settings = await StoreSettings.create({
      storeName: store,
      deliveryCompany: "yalidine",
    });
  }

  // Load wilayas ONLY for the active delivery company
  const areas = await DeliveryArea.find({
    store,
    company: settings.deliveryCompany,
  }).sort({ wilaya: 1 });

  res.json({
    areas,
    activeCompany: settings.deliveryCompany,
  });
});

export const createDeliveryArea = asyncHandler(async (req, res) => {
  const { wilaya, store, priceHome = 600, priceDesk = 700, isActive = true } = req.body;

  if (!wilaya || !store) {
    res.status(400);
    throw new Error("Wilaya and store are required");
  }

  // Get active company for this store
  const settings = await StoreSettings.findOne({ storeName: store });
  const company = settings.deliveryCompany;

  // Unique check: wilaya + store + company
  const exists = await DeliveryArea.findOne({
    store,
    company,
    wilaya: wilaya.trim(),
  });

  if (exists) {
    res.status(400);
    throw new Error(`This wilaya already exists for ${company.toUpperCase()} in this store`);
  }

  const area = await DeliveryArea.create({
    wilaya: wilaya.trim(),
    store,
    company,
    priceHome: Number(priceHome),
    priceDesk: Number(priceDesk),
    isActive,
  });

  res.status(201).json(area);
});

export const updateDeliveryArea = asyncHandler(async (req, res) => {
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) {
    res.status(404);
    throw new Error("Delivery area not found");
  }

  Object.assign(area, req.body);
  await area.save();
  res.json(area);
});

export const deleteDeliveryArea = asyncHandler(async (req, res) => {
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) {
    res.status(404);
    throw new Error("Delivery area not found");
  }

  await area.deleteOne();
  res.json({ message: "Delivery area removed" });
});

export const switchDeliveryCompany = asyncHandler(async (req, res) => {
  const { storeName, newCompany } = req.body;

  if (!storeName || !newCompany) {
    res.status(400);
    throw new Error("storeName and newCompany are required");
  }

  if (!["yalidine", "zr-Express"].includes(newCompany)) {
    res.status(400);
    throw new Error("Invalid delivery company");
  }

  const settings = await StoreSettings.findOneAndUpdate(
    { storeName },
    { deliveryCompany: newCompany },
    { upsert: true, new: true } // creates if not exists
  );

  res.json({
    message: "Delivery company switched successfully",
    company: settings.deliveryCompany,
  });
});