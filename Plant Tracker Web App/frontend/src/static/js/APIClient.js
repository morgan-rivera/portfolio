import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = '/api';

const handleAuthError = (error) => {
  if (error.status === 401) {
    document.location = '/login'; // redirects to login if user unauthorized
  }
  throw error;
};

// *********************************************
// [AUTHENTICATION]
// todo check routes
const register = (username, email, password) => {
  return HTTPClient.post(`${BASE_API_PATH}/auth/register`, {
    username,
    email,
    password
  }).catch(handleAuthError);
};

const login = (identifier, password) => {
  return HTTPClient.post(`${BASE_API_PATH}/auth/login`, {
    identifier,
    password
  }).catch(handleAuthError);
};

const logout = () => {
  return HTTPClient.post(`${BASE_API_PATH}/auth/logout`, {});
};

// *********************************************
// [plants --> aka explore page]
// with filters = {}, user can pass filters directly (e.g. sun, small etc)
// for example /api/plants?search=size=small&sunlight=full
const getPlants = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${BASE_API_PATH}/plants?${params}` : `${BASE_API_PATH}/plants`;
  return HTTPClient.get(url)
  .catch(handleAuthError);
};

const getPlantById = (plantId) => {
  return HTTPClient.get(`${BASE_API_PATH}/plants/${plantId}`)
  .catch(handleAuthError);
};

const createPlant = (plantData) => {
  return HTTPClient.post(`${BASE_API_PATH}/plants`, plantData)
  .catch(handleAuthError);
};

// this uses HTTPClient.postFormData
// I added postFormData to HTTPClient because otherwise we needed to use fetch here
// TODO: check miniproject 3 (we did something similar to this there)
const uploadPlantPhoto = (plantId, photoFile, plantName = null) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  if (plantName) { // updated to accept plant name so that we can use it in dashboard.js
    formData.append('plantName', plantName);
  }
  return HTTPClient.postFormData(`${BASE_API_PATH}/plants/${plantId}/photo`, formData);
}

// *********************************************
//[MY PLANTS - DASHBOARD] (aka User collection) 
const getMyPlants = () => {
  return HTTPClient.get(`${BASE_API_PATH}/users/plants`) // updated
  .catch(handleAuthError);
};

const addToMyPlants = (plantId) => {
  return HTTPClient.post(`${BASE_API_PATH}/users/plants`, { plantId })  // updated
  .catch(handleAuthError);
};

const getPlantDetails = (plantId) => {
  return HTTPClient.get(`${BASE_API_PATH}/users/plants/${plantId}`)
    .catch(handleAuthError);
};

const updatePlant = (plantId, formData) => {
  return HTTPClient.putFormData(`${BASE_API_PATH}/users/plants/${plantId}`, formData);
};

const removeFromMyPlants = (userPlantId) => {
  return HTTPClient.delete(`${BASE_API_PATH}/users/plants/${userPlantId}`)  // updated
  .catch(handleAuthError);
};

// users can add custom plant directly to their collection  --> returns plant id
const addCustomPlantToUser = (plantData) => {
    return HTTPClient.post(`${BASE_API_PATH}/users/custom-plants`, plantData);
};

// *********************************************
// [SCHEDULE]
const getSchedule = () => {
  return HTTPClient.get(`${BASE_API_PATH}/schedule`).catch(handleAuthError);
};

const createSchedule = (scheduleData) => {
  return HTTPClient.post(`${BASE_API_PATH}/schedule`, scheduleData)
  .catch(handleAuthError);
};

const updateScheduleStatus = (scheduleId, completed) => {
  return HTTPClient.put(`${BASE_API_PATH}/schedule/${scheduleId}`, { completed })
  .catch(handleAuthError);
};

const deleteSchedule = (scheduleId) => {
  return HTTPClient.delete(`${BASE_API_PATH}/schedule/${scheduleId}`)
  .catch(handleAuthError);
};

// *********************************************
// [PROFILE]
const getProfile = () => {
  return HTTPClient.get(`${BASE_API_PATH}/users/profile`)
  .catch(handleAuthError);
};

const updateProfile = (username, bio) => {
  return HTTPClient.put(`${BASE_API_PATH}/users/profile`, { username, bio })
  .catch(handleAuthError);
};

const updateAvatar = (avatarUrl) => {
  return HTTPClient.put(`${BASE_API_PATH}/users/avatar`, { avatar: avatarUrl })
  .catch(handleAuthError);
};

const changePassword = (currentPassword, newPassword) => {
  return HTTPClient.put(`${BASE_API_PATH}/users/change-password`, { currentPassword, newPassword })
  .catch(handleAuthError);
};



export default {
  // [auth]
  register,
  login,
  logout,
  // [plants]
  getPlants,
  getPlantById,
  createPlant,
  uploadPlantPhoto,
  // [my plants]
  getMyPlants,
  addToMyPlants,
  getPlantDetails,
  updatePlant,
  removeFromMyPlants,
  addCustomPlantToUser,
  // [Schedule]
  getSchedule,
  createSchedule,
  updateScheduleStatus,
  deleteSchedule,
  // [profile]
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword
};