import React, { useState, useEffect } from 'react';
import { Search, Trophy, Users, BarChart3, Zap } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('PL');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');

  // Cargar ligas al iniciar
  useEffect(() => {
    fetchLeagues();
  }, []);

  // Cargar datos cuando cambia la liga
  useEffect(() => {
    if (selectedLeague) {
      fetchTeams();
      fetchMatches();
      fetchStandings();
    }
  }, [selectedLeague]);

  const fetchLeagues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leagues`);
      setLeagues(response.data.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/teams?league=${selectedLeague}`);
      setTeams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches/live?league=${selectedLeague}`);
      setMatches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchStandings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics/standings/${selectedLeague}`);
      setStandings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'LIVE': 'bg-red-100 text-red-800 animate-pulse',
      'IN_PLAY': 'bg-red-100 text-red-800 animate-pulse',
      'FINISHED': 'bg-green-100 text-green-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Futstats
              </h1>
            </div>
            <p className="text-slate-300 text-sm">Análisis de Fútbol en Tiempo Real</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Liga Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Selecciona una Liga
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {leagues.map((league) => (
              <button
                key={league.code}
                onClick={() => setSelectedLeague(league.code)}
                className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedLeague === league.code
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg scale-105'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <div className="text-xs md:text-sm">{league.name}</div>
                <div className="text-xs text-opacity-75 mt-1">{league.country}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'matches'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Partidos
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'standings'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Tabla
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'teams'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Equipos
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-slate-300">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-4">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-yellow-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(match.status)}`}>
                          {match.status === 'LIVE' || match.status === 'IN_PLAY' ? '🔴 EN VIVO' : match.status}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(match.utcDate)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <p className="font-bold text-lg">{match.homeTeam.name}</p>
                          {match.status === 'FINISHED' && (
                            <p className="text-2xl font-bold text-yellow-400 mt-2">{match.score.fullTime.home}</p>
                          )}
                        </div>
                        
                        <div className="px-4 py-2 mx-4">
                          {match.status === 'FINISHED' && (
                            <p className="text-3xl font-bold text-yellow-400">
                              {match.score.fullTime.home} - {match.score.fullTime.away}
                            </p>
                          )}
                          {(match.status === 'LIVE' || match.status === 'IN_PLAY') && (
                            <p className="text-3xl font-bold text-red-400 animate-pulse">
                              {match.score.halfTime.home} - {match.score.halfTime.away}
                            </p>
                          )}
                          {match.status === 'SCHEDULED' && (
                            <p className="text-xl text-slate-400">vs</p>
                          )}
                        </div>
                        
                        <div className="flex-1 text-center">
                          <p className="font-bold text-lg">{match.awayTeam.name}</p>
                          {match.status === 'FINISHED' && (
                            <p className="text-2xl font-bold text-yellow-400 mt-2">{match.score.fullTime.away}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
                    <p className="text-slate-400">No hay partidos disponibles en este momento</p>
                  </div>
                )}
              </div>
            )}

            {/* Standings Tab */}
            {activeTab === 'standings' && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Pos</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">PJ</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">G</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">E</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">P</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">GF</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">GC</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">DG</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-yellow-400">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings[0]?.table.map((team, index) => (
                      <tr
                        key={team.team.id}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-sm font-bold text-yellow-400">{team.position}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{team.team.name}</td>
                        <td className="px-4 py-3 text-center text-sm">{team.playedGames}</td>
                        <td className="px-4 py-3 text-center text-sm text-green-400">{team.won}</td>
                        <td className="px-4 py-3 text-center text-sm text-blue-400">{team.draw}</td>
                        <td className="px-4 py-3 text-center text-sm text-red-400">{team.lost}</td>
                        <td className="px-4 py-3 text-center text-sm">{team.goalsFor}</td>
                        <td className="px-4 py-3 text-center text-sm">{team.goalsAgainst}</td>
                        <td className="px-4 py-3 text-center text-sm">{team.goalDifference}</td>
                        <td className="px-4 py-3 text-center text-sm font-bold text-yellow-400">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {team.crest && (
                        <img
                          src={team.crest}
                          alt={team.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <p className="text-sm text-slate-400">{team.area?.name}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-400">Fundado en {team.founded || 'N/A'}</p>
                      {team.venue && <p className="text-xs text-slate-400 mt-1">Estadio: {team.venue}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-slate-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Futstats © 2026 - Datos proporcionados por Football-Data.org</p>
          <p className="mt-2">Esta es una herramienta informativa para análisis de estadísticas de fútbol</p>
        </div>
      </footer>
    </div>
  );
}
