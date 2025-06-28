import express from 'express';
import Request from '../models/Request.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create new assistance request
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, priority, location, urgentBy, requirements } = req.body;

    const request = new Request({
      title,
      description,
      type,
      priority,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address
      },
      requester: req.userId,
      urgentBy: urgentBy ? new Date(urgentBy) : undefined,
      requirements: requirements || {}
    });

    await request.save();
    await request.populate('requester', 'name email role avatar');

    // Emit real-time notification
    req.io.emit('new-request', {
      id: request._id,
      title: request.title,
      type: request.type,
      priority: request.priority,
      location: request.location,
      requester: request.requester
    });

    res.status(201).json({
      message: 'Assistance request created successfully',
      request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error creating request' });
  }
});

// Get all requests with filters
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      priority, 
      status = 'pending', 
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
    
    // Filter by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
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

    const requests = await Request.find(query)
      .populate('requester', 'name email role avatar')
      .populate('responder', 'name email role avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name email role avatar')
      .populate('responder', 'name email role avatar');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error fetching request' });
  }
});

// Accept assistance request
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer available' });
    }

    request.status = 'accepted';
    request.responder = req.userId;
    request.acceptedAt = new Date();

    await request.save();
    await request.populate(['requester', 'responder'], 'name email role avatar');

    // Notify requester
    req.io.to(request.requester._id.toString()).emit('request-accepted', {
      requestId: request._id,
      responder: request.responder
    });

    res.json({
      message: 'Request accepted successfully',
      request
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error accepting request' });
  }
});

// Update request status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is authorized to update status
    if (request.requester.toString() !== req.userId && 
        request.responder?.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    if (status === 'completed') {
      request.completedAt = new Date();
    }

    await request.save();
    await request.populate(['requester', 'responder'], 'name email role avatar');

    res.json({
      message: 'Request status updated successfully',
      request
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error updating request status' });
  }
});

// Get user's requests
router.get('/user/my-requests', auth, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let query = { requester: req.userId };
    if (type !== 'all') {
      query.status = type;
    }

    const requests = await Request.find(query)
      .populate('responder', 'name email role avatar')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error fetching user requests' });
  }
});

// Get volunteer's accepted requests
router.get('/volunteer/accepted', auth, async (req, res) => {
  try {
    const requests = await Request.find({ responder: req.userId })
      .populate('requester', 'name email role avatar')
      .sort({ acceptedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get volunteer requests error:', error);
    res.status(500).json({ message: 'Server error fetching volunteer requests' });
  }
});

export default router;