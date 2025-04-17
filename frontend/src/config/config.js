const config = {
  development: {
    apiBaseUrl: 'http://localhost:5000/api',
    uploadMaxSize: 5 * 1024 * 1024, // 5MB
    supportedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    maxUploadFiles: 5
  },
  production: {
    apiBaseUrl: '/api',
    uploadMaxSize: 5 * 1024 * 1024,
    supportedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    maxUploadFiles: 5
  }
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];