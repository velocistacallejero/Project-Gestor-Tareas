import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAward, FiUser } from 'react-icons/fi';

const TeamRanking = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamRanking();
  }, []);

  const fetchTeamRanking = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/team/ranking');
      setTeamMembers(response.data);
    } catch (err) {
      console.error('Error fetching team ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando ranking...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiAward className="mr-2 text-yellow-500" />
        Ranking del Equipo
      </h2>
      
      {teamMembers.length > 0 ? (
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={member._id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="relative">
                    {index === 0 ? (
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FiAward className="text-yellow-500 text-xl" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                    )}
                    {index < 3 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-xs text-gray-500">
                      {member.completedTasks} tareas completadas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {Math.round(member.efficiency * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-blue-500' : 
                    index === 2 ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${member.efficiency * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay miembros en el equipo</p>
      )}
    </div>
  );
};

export default TeamRanking;