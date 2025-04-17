import { Link } from 'react-router-dom';
import servicesHero from '../assets/images/services-hero.svg';
import birthCertificate from '../assets/images/birth-certificate.svg';
import residenceCertificate from '../assets/images/residence-certificate.svg';
import incomeCertificate from '../assets/images/income-certificate.svg';
import communityCertificate from '../assets/images/community-certificate.svg';

const Services = () => {
  const services = [
    {
      title: 'Birth Certificate',
      description: 'Official documentation of birth details including date, place, and parentage',
      image: birthCertificate,
      requirements: ['Valid ID proof', 'Hospital records', 'Parent\'s documents']
    },
    {
      title: 'Residence Certificate',
      description: 'Proof of residence certification for various official purposes',
      image: residenceCertificate,
      requirements: ['Address proof', 'Identity documents', 'Utility bills']
    },
    {
      title: 'Income Certificate',
      description: 'Official documentation of annual income for government schemes',
      image: incomeCertificate,
      requirements: ['Salary slips', 'Bank statements', 'Tax returns']
    },
    {
      title: 'Community Certificate',
      description: 'Official certification of community/caste for various benefits',
      image: communityCertificate,
      requirements: ['Family records', 'Previous certificates', 'Local authority letter']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Services Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600">Comprehensive certification solutions for all your needs</p>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {service.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Link 
                  to={'/auth/login'}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Application Process</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Register</h3>
            <p className="text-gray-600">Create your account with valid credentials</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Apply</h3>
            <p className="text-gray-600">Fill the application form with required details</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Submit</h3>
            <p className="text-gray-600">Upload necessary documents and submit</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2">Track</h3>
            <p className="text-gray-600">Monitor your application status online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;