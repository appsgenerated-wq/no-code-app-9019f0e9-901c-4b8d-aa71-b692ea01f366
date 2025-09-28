import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: ''});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const restaurantResponse = await manifest.from('Restaurant').find({ include: ['owner'], sort: { createdAt: 'desc' } });
      setRestaurants(restaurantResponse.data);
      
      if(user) {
        const orderResponse = await manifest.from('Order').find({ 
            filter: { customerId: user.id },
            include: ['restaurant'], 
            sort: { createdAt: 'desc' } 
        });
        setOrders(orderResponse.data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateRestaurant = async (event) => {
    event.preventDefault();
    try {
      await manifest.from('Restaurant').create(newRestaurant);
      setNewRestaurant({ name: '', description: '', address: '' });
      loadData(); 
    } catch(error) {
        console.error('Failed to create restaurant:', error);
        alert('Could not create restaurant.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FlavorFleet</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, <span className="font-semibold">{user?.name}</span>!</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition">Admin Panel</a>
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurants</h2>
            {isLoading ? <p>Loading restaurants...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl">
                    <img src={restaurant.photo?.thumbnail?.url || 'https://placehold.co/400x200'} alt={restaurant.name} className="w-full h-40 object-cover"/>
                    <div className="p-4">
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">{restaurant.address}</p>
                      <p className="text-gray-500 text-xs mt-2">Owner: {restaurant.owner?.name || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
             <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Your Restaurant</h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <input type="text" placeholder="Restaurant Name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})} required className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                <textarea placeholder="Description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" rows="3"/>
                 <input type="text" placeholder="Address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} required className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">Add Restaurant</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Recent Orders</h2>
              {isLoading ? <p>Loading orders...</p> : (
                 <div className="space-y-4">
                  {orders.length > 0 ? orders.map(order => (
                    <div key={order.id} className="border-b pb-2">
                      <p className="font-semibold text-gray-700">Order at {order.restaurant?.name}</p>
                      <p className="text-sm text-gray-500">Total: <span className="font-medium text-green-600">{order.total}</span></p>
                      <p className="text-sm text-gray-500">Status: <span className="font-medium text-blue-600 capitalize">{order.status}</span></p>
                    </div>
                  )) : <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
