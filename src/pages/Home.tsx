import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message  } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Omc {
  id: string;
  name: string;
  location: string | null;
  logo: string | null;
  contactPerson: string | null;
  contact: string | null;
  email: string | null;
  products: { name: string; price: number }[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CountResponse {
  stations: number;
  omcs: number;
}

const apiBase = import.meta.env.VITE_BASE_URL;
const Home: React.FC = () => {
   const [omcData, setOmcData] = useState<Omc[]>([]);
  const [totalOmcs, setTotalOmcs] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [stationCounts, setStationCounts] = useState<{ [key: string]: number }>({});

  // Fetch OMC data and counts
  useEffect(() => {
    const fetchData = async () => {
       try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
        // Fetch OMC list
        const omcResponse = await axios.get<Omc[]>(`${apiBase}/user/omcs`, config);
        const omcs = omcResponse.data;
        setOmcData(omcs);

        // Fetch total OMC count
        const countResponse = await axios.get<CountResponse>(`${apiBase}/user/count`, config);
        setTotalOmcs(countResponse.data.omcs);

        // Derive last updated timestamp
        if (omcs.length > 0) {
          const latestUpdate = omcs.reduce((latest, omc) => {
            const updateTime = new Date(omc.updatedAt).getTime();
            return updateTime > new Date(latest).getTime() ? omc.updatedAt : latest;
          }, omcs[0].updatedAt);
          const formattedDate = new Date(latestUpdate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          setLastUpdated(formattedDate);
        } else {
          setLastUpdated('No data available');
        }

        // Fetch station counts for each OMC
        const stationCountPromises = omcs.map((omc) =>
          axios.get<CountResponse>(`${apiBase}/user/count?omcId=${omc.id}`, config)
            .then((response) => ({ id: omc.id, count: response.data.stations }))
        );
        const stationCountResults = await Promise.all(stationCountPromises);
        const stationCountMap = stationCountResults.reduce((acc, { id, count }) => {
          acc[id] = count;
          return acc;
        }, {} as { [key: string]: number });
        setStationCounts(stationCountMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#EEFFF6] min-h-screen flex flex-col md:flex-row p-2 sm:p-3 lg:p-4">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Section 1: Hero Section */}
        <section className="mb-6 sm:mb-8">
          <div
            className="relative shadow-slate-900 flex flex-col items-center sm:items-start justify-center p-6 sm:p-8 rounded-lg shadow-md bg-cover bg-center text-white overflow-hidden"
            style={{ backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)),
        url('/hero-image-1.svg')
      ` }}
          >
            <div className="flex-1 text-center sm:text-left z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3">
                Welcome back, Doris Scott!
              </h2>
              <p className="text-base text-[#D2FFD8] sm:text-lg mb-4">
                Manage your OMC's here
              </p>
              <Button
                type="primary"
                className="!bg-[#ffffff] hover:!bg-[#e5e7e6f1] !text-[#00380A] font-semibold py-2 px-4 rounded-md"
                icon={<PlusOutlined />}
                onClick={() => window.location.href = '/register-omc'}
              >
                Register OMC
              </Button>
            </div>
          </div>
        </section>

       {/* Section 2: Total OMC's */}
        <section className="mb-6 sm:mb-8">
          <div className="relative flex flex-col shadow-slate-400 sm:flex-row items-center sm:items-start justify-between p-5 sm:p-6 rounded-lg shadow-md bg-white overflow-hidden">
            {/* Text Content */}
            <div className="flex-1 mb-4 sm:mb-0 sm:pr-6 z-10">
              <h3 className="text-md sm:text-md lg:text-xl font-bold text-[#1C1C1C] mb-2">
                Total OMC's
              </h3>
              <p className="text-base sm:text-xs text-[#868FA0] mb-4">
                Last updated: {lastUpdated}
              </p>
              <p className="text-6xl sm:text-8xl font-bold text-[#000000]">
                {totalOmcs}
              </p>
            </div>
            {/* Image */}
            <div className="flex-1 flex justify-center items-center sm:mt-2 ">
              <img
                src="/hero-image-2.svg"
                alt="Total OMC's"
                className="w-full max-w-[290px] sm:max-w-[300px] h-auto object-contain rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Daily Sales */}
        <section>
          <div className="relative flex flex-col items-center sm:items-start justify-between p-6 sm:p-8 rounded-lg shadow-lg bg-white overflow-hidden min-h-[400px]">
            {/* Header */}
            <div className="flex justify-between items-center w-full mb-4 z-10">
              <h3 className="text-md sm:text-md lg:text-xl font-bold text-[#1C1C1C]">
                Daily Sales
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-base text-[#868FA0] sm:text-md">
                  Today
                </span>
                <DownOutlined className="!text-[#706c6a]" style={{fontSize:"10px"}} />
              </div>
            </div>
            {/* Image */}
            <div className="flex-2 flex justify-center items-center w-full">
              <img
                src="/hero-image-3.svg"
                alt="Daily Sales"
                className="w-full max-w-[600px] h-auto object-contain"
              />
            </div>
          </div>
        </section>
      </div>

    {/* Right Section (Hidden on Mobile) */}
<aside className="hidden md:block w-[300px] ml-6 bg-[#D2FFD8] rounded-lg shadow-lg h-screen sticky top-0 overflow-y-auto scrollbar-hide">
  <div className="p-3">
    <h3 className="text-md font-bold text-[#000000] mb-4">
      All Fuel Stations
    </h3>
    <div className="space-y-4">
            {omcData.map((omc) => (
              <div
                key={omc.id}
                className="flex justify-between items-center p-4 rounded-lg shadow-slate-400 shadow-md bg-white"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#000000] mb-1">
                    {omc.name}
                  </h4>
                  <p className="text-sm text-[#868FA0] mb-2">
                    All Stations
                  </p>
                  <p className="text-2xl font-bold text-[#000000]">
                    {stationCounts[omc.id] ?? 0}
                  </p>
                </div>
                <img
                  src={
                    omc.logo
                      ? `${apiBase}/${omc.logo.replace(/\\/g, '/')}`
                      : '/bidi-logo.svg'
                  }
                  alt={`${omc.name} Logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;