const axios = require('axios');

const APIS = {
  FOOTBALL_DATA: {
    baseURL: 'https://api.football-data.org/v4',
    apiKey: process.env.FOOTBALL_DATA_API_KEY,
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
    }
  }
};

const LEAGUES = {
  PREMIER_LEAGUE: 'PL',
  LA_LIGA: 'PD',
  SERIE_A: 'SA',
  BUNDESLIGA: 'BL1',
  LIGUE_1: 'FL1',
  CHAMPIONS_LEAGUE: 'CL',
  LIGA_MX: 'MX',
  MLS: 'USA'
};

const fetchFootballData = async (endpoint) => {
  try {
    const response = await axios.get(
      `${APIS.FOOTBALL_DATA.baseURL}${endpoint}`,
      { headers: APIS.FOOTBALL_DATA.headers }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error en Football-Data: ${error.message}`);
    throw error;
  }
};

const getAllLeagues = async () => {
  try {
    const data = await fetchFootballData('/competitions');
    return data.competitions;
  } catch (error) {
    console.error('❌ Error al obtener ligas:', error.message);
    return [];
  }
};

const getTeamsByLeague = async (leagueCode) => {
  try {
    const data = await fetchFootballData(`/competitions/${leagueCode}/teams`);
    return data.teams;
  } catch (error) {
    console.error(`❌ Error al obtener equipos de ${leagueCode}:`, error.message);
    return [];
  }
};

const getMatches = async (leagueCode) => {
  try {
    const data = await fetchFootballData(`/competitions/${leagueCode}/matches?status=LIVE,SCHEDULED`);
    return data.matches || [];
  } catch (error) {
    console.error(`❌ Error al obtener partidos de ${leagueCode}:`, error.message);
    return [];
  }
};

const getFinishedMatches = async (leagueCode, days = 30) => {
  try {
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const data = await fetchFootballData(
      `/competitions/${leagueCode}/matches?status=FINISHED&dateFrom=${fromDate}`
    );
    return data.matches || [];
  } catch (error) {
    console.error(`❌ Error al obtener resultados de ${leagueCode}:`, error.message);
    return [];
  }
};

const getStandings = async (leagueCode) => {
  try {
    const data = await fetchFootballData(`/competitions/${leagueCode}/standings`);
    return data.standings || [];
  } catch (error) {
    console.error(`❌ Error al obtener standings de ${leagueCode}:`, error.message);
    return [];
  }
};

const getTeamStatistics = async (teamId) => {
  try {
    const data = await fetchFootballData(`/teams/${teamId}`);
    return data;
  } catch (error) {
    console.error(`❌ Error al obtener estadísticas del equipo ${teamId}:`, error.message);
    return null;
  }
};

const getMatchDetails = async (matchId) => {
  try {
    const data = await fetchFootballData(`/matches/${matchId}`);
    return data;
  } catch (error) {
    console.error(`❌ Error al obtener detalles del partido ${matchId}:`, error.message);
    return null;
  }
};

module.exports = {
  fetchFootballData,
  getAllLeagues,
  getTeamsByLeague,
  getMatches,
  getFinishedMatches,
  getStandings,
  getTeamStatistics,
  getMatchDetails,
  LEAGUES,
  APIS
};