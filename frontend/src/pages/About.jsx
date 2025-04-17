import React from 'react';
import aboutHero from '../assets/images/about-hero.svg';
import teamMember from '../assets/images/team-member.svg';

const About = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'Department Head',
      image: teamMember
    },
    {
      name: 'Sarah Johnson',
      role: 'Certificate Manager',
      image: teamMember
    },
    {
      name: 'Michael Brown',
      role: 'Technical Support',
      image: teamMember
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutHero})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-2xl mx-auto">Dedicated to providing efficient and secure certificate management services to our citizens</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8">
              To streamline the certificate application process and provide citizens with a seamless, transparent, and efficient service for all their certification needs.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-3xl text-blue-600 mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
                <p className="text-gray-600">Quick processing and delivery of certificates</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-3xl text-blue-600 mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Security</h3>
                <p className="text-gray-600">Ensuring data protection and privacy</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-3xl text-blue-600 mb-4">💫</div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">Clear and open communication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-lg">Certificates Issued</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-lg">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-lg">Support Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-lg">Happy Citizens</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;