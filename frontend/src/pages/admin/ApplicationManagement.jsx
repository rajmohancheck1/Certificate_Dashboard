import React, { useState, useEffect } from 'react';
import { certificateAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const ApplicationManagement = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [displayedApplications, setDisplayedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchApplications();
  }, []);

  // Effect to handle pagination on the client side
  useEffect(() => {
    if (allApplications.length > 0) {
      paginateApplications();
    }
  }, [currentPage, allApplications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await certificateAPI.getAll();
      
      // Sort applications by applicationDate in descending order (latest first)
      const sortedApplications = response.data.sort((a, b) => 
        new Date(b.applicationDate) - new Date(a.applicationDate)
      );
      
      setAllApplications(sortedApplications);
      setTotalPages(Math.ceil(sortedApplications.length / itemsPerPage));
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const paginateApplications = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedApplications(allApplications.slice(startIndex, endIndex));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      await certificateAPI.updateStatus(id, { status, adminRemarks: remarks });
      fetchApplications(); // Refresh the list
      setSelectedApplication(null);
    } catch (err) {
      setError('Failed to update application status');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Application Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedApplications.map((application) => (
              <tr key={application._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.certificateType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.applicant?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(application.applicationDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/applications/${application._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    View
                  </Link>
                  
                  {/* {application.status === 'pending' && (
                    <div className="space-x-2 inline">
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'approved', '')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{displayedApplications.length}</span> of{' '}
              <span className="font-medium">{allApplications.length}</span> applications
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === pageNumber
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
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

export default ApplicationManagement;