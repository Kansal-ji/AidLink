import express from 'express';
import Alert from '../models/Alert.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create new alert
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, severity, location, images } = req.body;

    const alert = new Alert({
      title,
      description,
      type,
      severity,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address
      },
      createdBy: req.userId,
      images: images || []
    });

    await alert.save();
    await alert.populate('createdBy', 'name email role avatar');

    // Emit real-time notification
    req.io.emit('new-alert', {
      id: alert._id,
      title: alert.title,
      type: alert.type,
      severity: alert.severity,
      location: alert.location,
      createdBy: alert.createdBy
    });

    res.status(201).json({
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error creating alert' });
  }
});

// Get all alerts with filters
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      severity, 
      status = 'active', 
      lat, 
      lng, 
      radius = 10000, // 10km default
      page = 1, 
      limit = 20 
    } = req.query;

    let query = {};
    
    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Filter by severity
    if (severity && severity !== 'all') {
      query.severity = severity;
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Geospatial query if coordinates provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const alerts = await Alert.find(query)
      .populate('createdBy', 'name email role avatar')
      .populate('responders.user', 'name email role avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.json({
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error fetching alerts' });
  }
});

// Get single alert
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('createdBy', 'name email role avatar')
      .populate('responders.user', 'name email role avatar');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ alert });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ message: 'Server error fetching alert' });
  }
});

// Update alert status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.status = status;
    if (status === 'resolved') {
      alert.resolvedAt = new Date();
    }

    await alert.save();
    await alert.populate('createdBy', 'name email role avatar');

    res.json({
      message: 'Alert status updated successfully',
      alert
    });
  } catch (error) {
    console.error('Update alert status error:', error);
    res.status(500).json({ message: 'Server error updating alert status' });
  }
});

// Add responder to alert
router.post('/:id/respond', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Check if user already responded
    const existingResponder = alert.responders.find(
      r => r.user.toString() === req.userId
    );

    if (existingResponder) {
      return res.status(400).json({ message: 'You have already responded to this alert' });
    }

    alert.responders.push({
      user: req.userId,
      respondedAt: new Date(),
      status: 'responding'
    });

    await alert.save();
    await alert.populate('responders.user', 'name email role avatar');

    res.json({
      message: 'Response added successfully',
      alert
    });
  } catch (error) {
    console.error('Add responder error:', error);
    res.status(500).json({ message: 'Server error adding responder' });
  }
});

export default router;