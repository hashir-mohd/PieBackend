import mongoose from 'mongoose';

const metaItemSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const MetaItem = mongoose.model('MetaItem', metaItemSchema);
export default MetaItem;
