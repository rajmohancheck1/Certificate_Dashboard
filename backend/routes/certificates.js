const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/certificates
// @desc    Submit a new certificate application
router.post('/', [
  protect,
  [
    check('certificateType', 'Certificate type is required').not().isEmpty(),
    check('subdivision', 'Subdivision is required').not().isEmpty(),
    check('applicationData', 'Application data is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCertificate = new Certificate({
      applicant: req.user.id,
      certificateType: req.body.certificateType,
      subdivision: req.body.subdivision,
      applicationData: req.body.applicationData,
      supportingDocuments: req.body.supportingDocuments || []
    });

    const certificate = await newCertificate.save();
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/certificates
// @desc    Get all certificates (admin) or user's certificates (citizen)
router.get('/', protect, async (req, res) => {
  try {
    let certificates;
    if (req.user.role === 'admin') {
      certificates = await Certificate.find()
        .populate('applicant', ['name', 'email'])
        .populate('processedBy', ['name']);
    } else {
      certificates = await Certificate.find({ applicant: req.user.id })
        .populate('processedBy', ['name']);
    }
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('applicant', ['name', 'email'])
      .populate('processedBy', ['name']);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check if user has permission to view this certificate
    if (req.user.role !== 'admin' && certificate.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate status (admin only)
router.put('/:id', [
  protect,
  authorize('admin'),
  [
    check('status', 'Status is required').isIn(['approved', 'rejected']),
    check('adminRemarks', 'Admin remarks are required when rejecting').if((value, { req }) => req.body.status === 'rejected').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = req.body.status;
    certificate.adminRemarks = req.body.adminRemarks;
    certificate.processedBy = req.user.id;
    certificate.processedAt = Date.now();

    await certificate.save();
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/certificates/stats/dashboard
// @desc    Get certificate statistics for dashboard (admin only)
router.get('/stats/dashboard', [protect, authorize('admin')], async (req, res) => {
  try {
    const stats = await Promise.all([
      // Total applications by status
      Certificate.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Applications by certificate type
      Certificate.aggregate([
        { $group: { _id: '$certificateType', count: { $sum: 1 } } }
      ]),
      // Daily application trends (last 30 days)
      Certificate.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      statusDistribution: stats[0],
      certificateTypeDistribution: stats[1],
      dailyTrends: stats[2]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;