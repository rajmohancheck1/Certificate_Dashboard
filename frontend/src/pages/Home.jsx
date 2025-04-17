import { Link } from 'react-router-dom';
import digitalCertificate from '../assets/images/digital-certificate.svg';
import fastProcessing from '../assets/images/fast-processing.svg';
import support from '../assets/images/support.svg';
import Carousel from '../components/shared/Carousel';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Carousel
        images={[
          {
            url:"https://images.unsplash.com/photo-1565019011521-b0575cbb57c8?w=1600&h=800",
            alt: "Digital Certificate Management",
            title: "Secure Certificate Management System",
            description: "Streamlined process for all your certification needs",
            buttonText: "Get Started",
            buttonLink: "/my-applications"
          },
          {
            url: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1600&h=800",
            alt: "Fast Processing",
            title: "Quick and Efficient Processing",
            description: "Get your certificates processed in record time",
            buttonText: "Learn More",
            buttonLink: "/services"
          },
          {
            url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1600&h=800",
            alt: "24/7 Support",
            title: "24/7 Customer Support",
            description: "We're here to help you every step of the way",
            buttonText: "Contact Us",
            buttonLink: "/about"
          }
        ]}
      />

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={digitalCertificate} 
                  alt="Digital Certificates"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Certificates</h3>
              <p className="text-gray-600">Secure and verifiable digital certificates for all your needs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={fastProcessing} 
                  alt="Fast Processing"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Quick and efficient processing of your certificate applications</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={support} 
                  alt="24/7 Support"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all your queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Our Impact in Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="text-4xl font-bold text-blue-600 mb-2 transition-colors duration-300 group-hover:text-blue-700">10K+</div>
              <p className="text-gray-600">Certificates Issued</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="text-4xl font-bold text-blue-600 mb-2 transition-colors duration-300 group-hover:text-blue-700">5K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="text-4xl font-bold text-blue-600 mb-2 transition-colors duration-300 group-hover:text-blue-700">99%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="text-4xl font-bold text-blue-600 mb-2 transition-colors duration-300 group-hover:text-blue-700">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-blue-600 text-4xl mb-4 transition-colors duration-300 hover:text-blue-700">"</div>
              <p className="text-gray-600 mb-4">The certificate management system has streamlined our entire process. It's efficient and user-friendly.</p>
              <div className="font-semibold text-blue-900">John Doe</div>
              <div className="text-blue-600">Business Owner</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-blue-600 text-4xl mb-4 transition-colors duration-300 hover:text-blue-700">"</div>
              <p className="text-gray-600 mb-4">Outstanding support team! They helped me through every step of the certification process.</p>
              <div className="font-semibold text-blue-900">Jane Smith</div>
              <div className="text-blue-600">HR Manager</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-blue-600 text-4xl mb-4 transition-colors duration-300 hover:text-blue-700">"</div>
              <p className="text-gray-600 mb-4">Fast, reliable, and secure. Exactly what we needed for our certification requirements.</p>
              <div className="font-semibold text-blue-900">Mike Johnson</div>
              <div className="text-blue-600">IT Director</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">How long does the certification process take?</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Our streamlined process typically takes 2-3 business days from application to certificate issuance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">What types of certificates do you offer?</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">We offer a wide range of certificates including business, educational, and professional certifications.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">Is my information secure?</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Yes, we use industry-standard encryption and security measures to protect all user data and certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of satisfied users who trust our certificate management system</p>
          <Link 
            to="/auth/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;