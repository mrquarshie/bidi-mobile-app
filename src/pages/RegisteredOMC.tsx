import React from 'react';
import { Button } from 'antd';

const RegisteredOMC: React.FC = () => {
  // Placeholder OMC data (replace with actual data)
  const omcData = [
    {
      logo: '/goil-logo.svg',
      name: 'Goil',
      location: 'Accra, Ghana',
      phone: '030-123-4567',
      regNumber: 'OMC-123456',
    },
    {
      logo: '/total-logo.svg',
      name: 'Total Energies',
      location: 'Tema, Ghana',
      phone: '030-234-5678',
      regNumber: 'OMC-789012',
    },
    {
      logo: '/shell-logo.svg',
      name: 'Shell',
      location: 'Kumasi, Ghana',
      phone: '030-345-6789',
      regNumber: 'OMC-345678',
    },
    {
      logo: '/allied-logo.svg',
      name: 'Allied',
      location: 'Takoradi, Ghana',
      phone: '030-456-7890',
      regNumber: 'OMC-901234',
    },
    {
      logo: '/staroil-logo.svg',
      name: 'Star Oil',
      location: 'Cape Coast, Ghana',
      phone: '030-567-8901',
      regNumber: 'OMC-567890',
    },
    {
      logo: '/zenoil-logo.svg',
      name: 'Zen Oil',
      location: 'Tamale, Ghana',
      phone: '030-678-9012',
      regNumber: 'OMC-678901',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] md:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-6">
          Registered OMC
        </h2>
        <div className="space-y-4">
          {omcData.map((omc, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center p-6 rounded-lg shadow-md bg-white"
            >
              {/* First Section: Logo, Name, Location, Phone */}
              <div className="flex-1 flex items-center mb-4 lg:mb-0">
                <img
                  src={omc.logo}
                  alt={`${omc.name} Logo`}
                  className="w-24 h-24 object-contain mr-6 bg-[#E2F3E9] rounded-md p-3 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#3C3939] mb-1">
                    {omc.name}
                  </h3>
                  <p className="text-sm text-[#625E5C] mb-1">
                    {omc.location}
                  </p>
                  <p className="text-sm text-[#625E5C]">
                    {omc.phone}
                  </p>
                </div>
              </div>
              {/* Second Section: Registration Number and Add Station Button (Mobile/Tablet) */}
              <div className="flex-1 flex flex-col items-center lg:hidden space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    Registration Number
                  </h4>
                  <p className="text-base text-[#625E5C]">
                    {omc.regNumber}
                  </p>
                </div>
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => console.log(`Add Station for ${omc.name}`)}
                >
                  Add Station
                </Button>
              </div>
              {/* Second Section: Registration Number (Laptop) */}
              <div className="hidden lg:flex flex-1 flex-col items-center">
                <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                  Registration Number
                </h4>
                <p className="text-base text-[#625E5C]">
                  {omc.regNumber}
                </p>
              </div>
              {/* Third Section: Add Station Button (Laptop) */}
              <div className="hidden lg:flex flex-1 justify-end pr-4">
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => console.log(`Add Station for ${omc.name}`)}
                >
                  Add Station
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisteredOMC;