import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificateAPI } from '../../services/api';
import useFormValidation from '../../hooks/useFormValidation';
import { FiUpload, FiAlertCircle } from 'react-icons/fi';

const certificateTypes = [
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
  'General Affidavit'
];

const subdivisions = [
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
];

const validationRules = {
  certificateType: { required: true },
  subdivision: { required: true },
  'applicationData.purpose': { required: true, minLength: 10 },
  'applicationData.details': { required: true, minLength: 20 },
  'applicationData.declaration': { required: true }
};

const CertificateApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  const initialState = {
    certificateType: '',
    subdivision: '',
    applicationData: {
      purpose: '',
      details: '',
      declaration: false
    },
    supportingDocuments: []
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  } = useFormValidation(initialState, validationRules);

  const handleFileUpload = async (e) => {
    try {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);

      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('documents', file);
      });

      const response = await certificateAPI.uploadDocuments(formData);
      const uploadedDocuments = response.data;

      handleChange({
        target: {
          name: 'supportingDocuments',
          value: [...values.supportingDocuments, ...uploadedDocuments]
        }
      });
    } catch (error) {
      setError('Failed to upload documents. Please try again.');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    handleChange({
      target: {
        name: 'supportingDocuments',
        value: values.supportingDocuments.filter((_, i) => i !== index)
      }
    });
  };

  const renderError = (field) => {
    if (touched[field] && errors[field]) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FiAlertCircle className="mr-1" />
          {errors[field]}
        </p>
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await certificateAPI.submit(values);
      resetForm();
      navigate('/my-applications', { 
        state: { message: 'Application submitted successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Certificate Application</h1>
          <p className="mt-2 text-primary-100">Please fill in all required information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700">
                Certificate Type *
              </label>
              <select
                id="certificateType"
                name="certificateType"
                value={values.certificateType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select a certificate type</option>
                {certificateTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {renderError('certificateType')}
            </div>

            <div>
              <label htmlFor="subdivision" className="block text-sm font-medium text-gray-700">
                Subdivision *
              </label>
              <select
                id="subdivision"
                name="subdivision"
                value={values.subdivision}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select a subdivision</option>
                {subdivisions.map(subdivision => (
                  <option key={subdivision} value={subdivision}>{subdivision}</option>
                ))}
              </select>
              {renderError('subdivision')}
            </div>
          </div>

          <div>
            <label htmlFor="applicationData.purpose" className="block text-sm font-medium text-gray-700">
              Purpose of Certificate *
            </label>
            <input
              type="text"
              id="applicationData.purpose"
              name="applicationData.purpose"
              value={values.applicationData.purpose}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g., Education, Employment, Legal purposes"
            />
            {renderError('applicationData.purpose')}
          </div>

          <div>
            <label htmlFor="applicationData.details" className="block text-sm font-medium text-gray-700">
              Additional Details *
            </label>
            <textarea
              id="applicationData.details"
              name="applicationData.details"
              rows="4"
              value={values.applicationData.details}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Please provide any additional information relevant to your application"
            />
            {renderError('applicationData.details')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-500 transition-colors">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
              </div>
            </div>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="applicationData.declaration"
                  name="applicationData.declaration"
                  type="checkbox"
                  checked={values.applicationData.declaration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="applicationData.declaration" className="text-sm font-medium text-gray-700">
                  Declaration *
                </label>
                <p className="text-sm text-gray-500">
                  I hereby declare that all the information provided is true and correct to the best of my knowledge.
                </p>
              </div>
            </div>
            {renderError('applicationData.declaration')}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateApplication;