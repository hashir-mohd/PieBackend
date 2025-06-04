import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'view', 'comment'],
    required: true
  },
  content: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate likes/views from same user
interactionSchema.index({ userId: 1, videoId: 1, type: 1 }, { 
  unique: true,
  partialFilterExpression: { type: { $in: ['like', 'view'] } }
});

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;
