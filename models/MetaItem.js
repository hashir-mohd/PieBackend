import mongoose from 'mongoose';

const metaItemSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['tag', 'category', 'genre', 'location', 'custom']
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  // Optional fields for future use
  thumbnailUrl: {
    type: String,
    required: false
  },
  label: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

const MetaItem = mongoose.model('MetaItem', metaItemSchema);
export default MetaItem;
