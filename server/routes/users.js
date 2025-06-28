import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get nearby volunteers
router.get('/volunteers/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 10000, skills } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    let query = {
      role: 'volunteer',
      availability: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };

    // Filter by skills if provided
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    const volunteers = await User.find(query)
      .select('name email role avatar skills rating completedRequests location')
      .limit(20);

    res.json({ volunteers });
  } catch (error) {
    console.error('Get nearby volunteers error:', error);
    res.status(500).json({ message: 'Server error fetching volunteers' });
  }
});

// Update user location
router.put('/location', auth, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      address: address || ''
    };

    await user.save();

    res.json({
      message: 'Location updated successfully',
      location: user.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error updating location' });
  }
});

// Update volunteer availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can update availability' });
    }

    user.availability = availability;
    await user.save();

    res.json({
      message: 'Availability updated successfully',
      availability: user.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error updating availability' });
  }
});

// Update volunteer skills
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can update skills' });
    }

    user.skills = skills;
    await user.save();

    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Server error updating skills' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      completedRequests: user.completedRequests,
      rating: user.rating,
      verified: user.verified,
      role: user.role
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error fetching user stats' });
  }
});

export default router;