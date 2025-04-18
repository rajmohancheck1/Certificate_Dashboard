const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateType: {
    type: String,
    required: true,
    enum: [
      'Income Certificate',
      'Age/Nationality/Domicile',
      'Solvency Certificate',
      'Senior Citizen Certificate',
      'Temporary Residence Certificate',
      'Cultural Programme Permission',
      'Small Land Holder Farmer Certificate',
      'Landless Certificate',
      'Agriculturist Certificate',
      'Certificate of Residence in Hilly Area',
      'Certified Copy',
      'General Affidavit',
      'Birth Certificate',
      'Community Certificate'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  subdivision: {
    type: String,
    required: true,
    enum: [
      'Alandur',
      'Ambattur',
      'Anna Nagar',
      'Adyar',
      'Kodambakkam',
      'Madhavaram',
      'Perungudi',
      'Sholinganallur',
      'Teynampet',
      'Thiruvottiyur',
      'Tondiarpet',
      'Velachery'
    ]
  },
  applicationData: {
    type: Object,
    required: true
  },
  supportingDocuments: [{
    documentType: String,
    documentUrl: String,
    uploadedAt: Date
  }],
  adminRemarks: {
    type: String,
    default: ''
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  applicationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
certificateSchema.index({ applicant: 1, status: 1 });
certificateSchema.index({ certificateType: 1, status: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);