import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface City {
  name: string;
  country: string;
  timezone: string;
  id: number;
}

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesModal, setShowFavoritesModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&facet=country&refine.country=United+States&rows=1000`);
        const data = response.data.records.map((record: any) => ({
          id: record.recordid,
          name: record.fields.name,
          country: record.fields.country,
          timezone: record.fields.timezone,
        }));
        setCities(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const toggleFavorite = (cityName: string) => {
    const updatedFavorites = favorites.includes(cityName)
      ? favorites.filter((city) => city !== cityName)
      : [...favorites, cityName];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const sortedCities = [...cities].sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a as any)[sortBy].localeCompare((b as any)[sortBy]);
    } else {
      return (b as any)[sortBy].localeCompare((a as any)[sortBy]);
    }
  });

  const filteredCities = sortedCities.filter((city: { name: string; country: string; }) =>
    (city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (city.country && city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleShowFavoritesModal = () => {
    setShowFavoritesModal(true);
  };

  const handleCloseFavoritesModal = () => {
    setShowFavoritesModal(false);
  };

  return (
    <div className="container mx-auto overflow-x-auto">
      <div className="flex justify-between items-center">
        <div>
          <input
            type="text"
            className="my-6 mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            placeholder="Search"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          {favorites.length > 0 && (
            <button className="text-yellow-600 hover:text-indigo-900" onClick={handleShowFavoritesModal}>View Favorites</button>
          )}
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-100">
          <tr>
            <th onClick={() => handleSort('name')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('country')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country {sortBy === 'country' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('timezone')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timezone {sortBy === 'timezone' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorite</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCities.length > 0 ? (
            filteredCities.map((city: { id: any; name: any; country: any; timezone: any; }) => (
              <tr key={city.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/weather/${city.name}`} className="text-indigo-600 hover:text-indigo-900">{city.name}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{city.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">{city.timezone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className={`text-indigo-600 hover:text-indigo-900 focus:outline-none ${favorites.includes(city.name) ? 'font-bold' : ''}`}
                    onClick={() => toggleFavorite(city.name)}
                  >
                    {favorites.includes(city.name) ? 'Remove' : 'Add'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No cities found</td>
            </tr>
          )}
        </tbody>
      </table>
      {showFavoritesModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">Favorite Cities</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{
                        favorites.map((favorite, index) => (
                          <span key={index}>{favorite}<br /></span>
                        ))
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleCloseFavoritesModal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CitiesTable;
