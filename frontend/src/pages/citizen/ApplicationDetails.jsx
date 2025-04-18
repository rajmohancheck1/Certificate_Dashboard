import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { certificateAPI } from '../../services/api';
import config from '../../config/config';
import { useAuth } from '../../contexts/AuthContext';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await certificateAPI.getById(id);
      setApplication(response.data);
    } catch (err) {
      setError('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      await certificateAPI.updateStatus(id, { status, adminRemarks: remarks });
      fetchApplicationDetails(); // Refresh the application details
      setSelectedApplication(null);
    } catch (err) {
      setError('Failed to update application status');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!application) return <div className="p-4">Application not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Certificate Application Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Application ID: {application._id}
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Certificate Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{application.certificateType}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  application.status === 'approved' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Purpose</dt>
              <dd className="mt-1 text-sm text-gray-900">{application.applicationData.purpose}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Details</dt>
              <dd className="mt-1 text-sm text-gray-900">{application.applicationData.details}</dd>
            </div>

            {application.adminRemarks && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Admin Remarks</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.adminRemarks}</dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Supporting Documents</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {application.supportingDocuments.map((doc, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {doc.documentType}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-primary-600 hover:text-primary-500"
                          onClick={(e) => {
                            e.preventDefault();
                            const token = localStorage.getItem('token');
                            const url = `${config.apiBaseUrl}/certificates/document/${doc.documentUrl}`;
                            fetch(url, {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                            })
                              .then(response => {
                                if (!response.ok) throw new Error('Failed to fetch document');
                                return response.blob();
                              })
                              .then(blob => {
                                const fileUrl = window.URL.createObjectURL(blob);
                                window.open(fileUrl, '_blank');
                              })
                              .catch(error => {
                                console.error('Error fetching document:', error);
                                alert('Failed to open document. Please try again later.');
                              });
                          }}
                        >
                          View
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Application Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(application.applicationDate).toLocaleDateString()}
              </dd>
            </div>

            {application.processedAt && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Processed Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(application.processedAt).toLocaleDateString()}
                </dd>
              </div>
            )}
            
            {/* Admin Controls - Only visible to admin users */}
            {isAdmin && application.status === 'pending' && (
              <div className="sm:col-span-2 mt-4">
                <dt className="text-sm font-medium text-gray-500">Admin Actions</dt>
                <dd className="mt-2">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(application._id, 'approved', '')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {/* Rejection Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reject Application</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="4"
              placeholder="Enter rejection reason"
              id="rejectionRemarks"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const remarks = document.getElementById('rejectionRemarks').value;
                  handleStatusUpdate(selectedApplication._id, 'rejected', remarks);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;