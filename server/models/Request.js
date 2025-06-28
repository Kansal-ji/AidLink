import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Request title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Request description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['medical', 'food', 'shelter', 'transportation', 'rescue', 'supplies', 'other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: Date,
  completedAt: Date,
  urgentBy: Date,
  estimatedDuration: {
    type: Number, // in minutes
    default: 60
  },
  requirements: {
    peopleNeeded: {
      type: Number,
      default: 1,
      min: 1
    },
    skillsRequired: [{
      type: String,
      enum: ['medical', 'rescue', 'food-distribution', 'transportation', 'shelter', 'communication']
    }],
    equipmentNeeded: [String]
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Index for geospatial queries
requestSchema.index({ location: '2dsphere' });
requestSchema.index({ type: 1, status: 1 });
requestSchema.index({ priority: 1, status: 1 });
requestSchema.index({ createdAt: -1 });

export default mongoose.model('Request', requestSchema);