const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    type:             { type: String, default: '' },
    date:             { type: String, required: true },
    venue:            { type: String, default: '' },
    mode:             { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' },
    speaker:          { type: String, default: '' },
    registrationLink: { type: String, default: '' },
    description:      { type: String, default: '' },
    tags:             [{ type: String }],
    thumbnail:        { type: String, default: '' },
    speakerPhoto:     { type: String, default: '' },
    status:           { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    featured:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
