import React from 'react';
import { Leaf, Target, Users, Tractor } from 'lucide-react';

// Team members data
const teamMembers = [
  {
    name: 'Lakshay',
    role: 'Founder',
    imageUrl: 'https://placehold.co/400x400/A3E635/14532D?text=L',
    bio: 'Grew up on a farm and is passionate about bridging the gap between local farmers and consumers.',
  },
  
  
];

// Core values data
const values = [
    {
        icon: <Leaf size={40} className="text-green-600" />,
        title: "Quality & Freshness",
        description: "We are committed to providing the freshest, highest-quality produce directly from local farms. Every item is hand-picked and delivered with care."
    },
    {
        icon: <Tractor size={40} className="text-green-600" />,
        title: "Support Local Farmers",
        description: "Our platform empowers local farmers by giving them a fair market to sell their produce, helping sustain local agriculture and communities."
    },
    {
        icon: <Target size={40} className="text-green-600" />,
        title: "Sustainability",
        description: "We believe in sustainable farming practices that respect the environment. We partner with farms that share our commitment to a healthier planet."
    },
    {
        icon: <Users size={40} className="text-green-600" />,
        title: "Community Focused",
        description: "FarmFresh is more than a marketplace; it's a community of farmers, buyers, and food lovers dedicated to a better food system."
    }
]

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 bg-green-100">
        <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2940&auto=format&fit=crop" 
            alt="Lush green field" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">About FarmFresh</h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl">Connecting you to the heart of agriculture, one fresh delivery at a time.</p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 sm:py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-800">Our Story</h2>
            <p className="mt-2 text-lg text-gray-600">From a simple idea to a thriving community.</p>
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
            <div className="mb-8 md:mb-0">
                <img 
                    src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2940&auto=format&fit=crop" 
                    alt="Farmer holding a basket of fresh vegetables" 
                    className="rounded-lg shadow-2xl w-full h-auto"
                />
            </div>
            <div className="text-base sm:text-lg text-gray-700 space-y-4">
                <p>
                    FarmFresh was born from a simple yet powerful idea: everyone should have access to fresh, locally-grown food, and every farmer should have a fair opportunity to sell their harvest.
                </p>
                <p>
                    We saw the disconnect between the hardworking individuals who grow our food and the communities that consume it. Long supply chains meant produce was often less fresh and local farmers weren't getting the value they deserved.
                </p>
                <p>
                    We decided to change that. By creating a direct link between the farm and your table, we're building a more transparent, sustainable, and delicious food system for everyone.
                </p>
            </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-lime-50 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-green-800">Our Core Values</h2>
                  <p className="mt-2 text-lg text-gray-600">The principles that guide everything we do.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {values.map((value) => (
                    <div key={value.title} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-center mb-4">
                           {value.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-gray-600 text-base">{value.description}</p>
                    </div>
                ))}
              </div>
          </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-800">Meet Our Team</h2>
            <p className="mt-2 text-lg text-gray-600">The passionate people behind FarmFresh.</p>
          </div>
        
          <div className="flex justify-center gap-8 sm:gap-12 text-center">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <img className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover shadow-lg mb-4" src={member.imageUrl} alt={member.name} />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-green-700 font-medium">{member.role}</p>
                <p className="mt-2 text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

