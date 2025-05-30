import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MeetingCalendar = () => {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    googleCalendar: false
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/meetings');
      setMeetings(response.data);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMeeting({
      ...newMeeting,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/meetings', newMeeting);
      setNewMeeting({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        googleCalendar: false
      });
      fetchMeetings();
    } catch (err) {
      console.error('Error creating meeting:', err);
    }
  };

  const syncWithGoogle = async (meetingId) => {
    try {
      await axios.post(`http://localhost:5000/api/meetings/${meetingId}/sync-google`);
      alert('Reunión sincronizada con Google Calendar');
    } catch (err) {
      console.error('Error syncing with Google:', err);
      alert('Error al sincronizar con Google Calendar');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agenda de Reuniones</h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Nueva Reunión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={newMeeting.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={newMeeting.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={newMeeting.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                name="time"
                value={newMeeting.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="googleCalendar"
              checked={newMeeting.googleCalendar}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-gray-700">Sincronizar con Google Calendar</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Crear Reunión
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div key={meeting._id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{meeting.title}</h3>
                <p className="text-gray-600 mb-2">{meeting.description}</p>
                <div className="text-sm text-gray-500">
                  <p>
                    Fecha y hora: {format(new Date(meeting.date), 'dd/MM/yyyy')} a las {meeting.time}
                  </p>
                  {meeting.googleCalendarEventId && (
                    <p className="text-green-500">Sincronizado con Google Calendar</p>
                  )}
                </div>
              </div>
              <div>
                {!meeting.googleCalendarEventId && (
                  <button
                    onClick={() => syncWithGoogle(meeting._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                  >
                    Sincronizar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingCalendar;