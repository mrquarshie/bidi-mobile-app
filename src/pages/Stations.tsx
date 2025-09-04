import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Station {
  id: string;
  name: string;
  pumpNo: number;
  region: string;
  district: string;
  town: string;
  managerName: string;
  managerContact: string;
  omcId: string;
  omc: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Omc {
  id: string;
  name: string;
}

const { Option } = Select;

const apiBase = import.meta.env.VITE_BASE_URL;

const Stations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [omcs, setOmcs] = useState<Omc[]>([]);
  const [selectedOmcId, setSelectedOmcId] = useState<string | null>(null);

  // Fetch OMCs for the dropdown
  useEffect(() => {
    const fetchOmcs = async () => {
      try {
        const response = await axios.get<Omc[]>(`${apiBase}/user/omcs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOmcs(response.data);
      } catch (error) {
        console.error('Error fetching OMC data:', error);
        toast.error('Failed to load OMCs.');
      }
    };
    fetchOmcs();
  }, []);

  // Fetch stations based on selected OMC
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get<Station[]>(`${apiBase}/user/stations`, {
          params: { omcId: selectedOmcId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error);
        toast.error('Failed to load stations.');
      }
    };
    fetchStations();
  }, [selectedOmcId]);

  const handleOmcChange = (value: string | undefined) => {
    setSelectedOmcId(value || null);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] md:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-6">
          Stations
        </h2>

        {/* OMC Filter Dropdown */}
        <div className="mb-6">
          <Select
            placeholder="Select OMC (All)"
            allowClear
            onChange={handleOmcChange}
            className="w-full max-w-xs"
          >
            {omcs.map((omc) => (
              <Option key={omc.id} value={omc.id}>
                {omc.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Stations List */}
        <div className="space-y-4">
          {stations.length === 0 ? (
            <p className="text-[#625E5C]">No stations found.</p>
          ) : (
            stations.map((station) => (
              <div
                key={station.id}
                className="flex flex-col lg:flex-row items-start p-6 rounded-lg shadow-md bg-white"
              >
                {/* First Section: Station Name, OMC, Location */}
                <div className="flex-1 mb-4 lg:mb-0">
                  <h3 className="text-xl font-bold text-[#3C3939] mb-1">
                    {station.name}
                  </h3>
                  <p className="text-sm text-[#625E5C] mb-1">
                    OMC: {station.omc.name}
                  </p>
                  <p className="text-sm text-[#625E5C] mb-1">
                    Location: {station.region}, {station.district}, {station.town}
                  </p>
                  <p className="text-sm text-[#625E5C]">
                    Number of Pumps: {station.pumpNo}
                  </p>
                </div>

                {/* Second Section: Manager Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    Station Manager
                  </h4>
                  <p className="text-sm text-[#625E5C] mb-1">
                    Name: {station.managerName}
                  </p>
                  <p className="text-sm text-[#625E5C]">
                    Contact: {station.managerContact}
                  </p>
                </div>

                {/* Third Section: Metadata */}
                <div className="flex-1 lg:text-right">
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    History
                  </h4>
                  <p className="text-sm text-[#625E5C] mb-1">
                    Created: {new Date(station.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[#625E5C]">
                    Updated: {new Date(station.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stations;