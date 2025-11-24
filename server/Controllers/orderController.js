// controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../Models/Order.js';

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 })
  res.json(orders);
 
});

export const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    phone,
    wilaya,
    address,
    deliveryType,    
    store,
    deliveryPrice,
    items
  } = req.body;

  // Validation
  if (!customerName || !phone || !wilaya || !deliveryType || !store || !items || items.length === 0) {
    res.status(400);
    throw new Error('Please fill all required fields: name, phone, wilaya, store, items');
  }

  if (deliveryType === 'home' && !address) {
    res.status(400);
    throw new Error('Address is required for home delivery');
  }

  // Check for bulk order (>7 of same item)
  const hasBulkItem = items.some(item => item.quantity > 7);

  // Calculate subtotal (only if not bulk)
  const subtotal = hasBulkItem
    ? null
    : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Final total (subtotal + delivery) — null if bulk
  const totalPrice = hasBulkItem
    ? null
    : (subtotal + (deliveryPrice || 0));

  // Create order
  const order = await Order.create({
    customerName: customerName.trim(),
    phone: phone.trim(),
    wilaya,
    address: deliveryType === 'home' ? address.trim() : null,
    deliveryType,
    store,
    deliveryPrice: deliveryPrice || 0,
    items,
    subtotal,
    totalPrice,
    isBulk: hasBulkItem,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: hasBulkItem
      ? "Bulk order received! Our team will call you to confirm price & delivery."
      : "Order placed successfully! We will call you soon to confirm.",
    orderId: order._id
  });
});


export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  // Validate status
  const validStatuses = ['pending', 'confirmed', 'in_delivery', 'reached', 'canceled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  // Update status
  order.status = status;
  await order.save();

  // Return the FULL updated order (important!)
  res.json({
    success: true,
    order: order  // ← This is what frontend expects
  });
});