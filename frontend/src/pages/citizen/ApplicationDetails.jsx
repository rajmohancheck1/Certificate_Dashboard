import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary-600 hover:text-primary-500"
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
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;