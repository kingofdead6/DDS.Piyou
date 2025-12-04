// routes/deliveryAreaRoutes.js
import express from 'express';
import { protect, admin } from '../Middleware/auth.js';
import {
  getDeliveryAreas,
  createDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
  switchDeliveryCompany,
} from '../Controllers/deliveryAreaController.js';

const router = express.Router();

// Public or protected as needed
router.get('/', getDeliveryAreas);                    
router.post('/',  createDeliveryArea); 
router.put('/switch-company', protect, admin, switchDeliveryCompany); 

router.put('/:id', protect, admin, updateDeliveryArea);
router.delete('/:id', protect, admin, deleteDeliveryArea);

export default router;