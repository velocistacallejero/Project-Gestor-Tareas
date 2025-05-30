import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Simular notificaciones cada minuto (en producción usaría WebSockets)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/mark-all-read');
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Notificaciones</h3>
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-500 hover:underline"
            >
              Marcar todas como leídas
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">No hay notificaciones</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;