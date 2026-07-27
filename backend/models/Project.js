const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    tags: [{ type: String }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
