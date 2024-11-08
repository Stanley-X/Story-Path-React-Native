const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjg3ODAifQ.Zp7gR5VriNb8_g2wkhI9N1q8s2HmZY13zyZ5PCcSUNA';
const USERNAME = 's4828780';

/**
 * Helper function for making API requests with fetch.
 * @param {string} endpoint - The endpoint to call.
 * @param {string} [method='GET'] - HTTP method (GET, POST, PATCH, DELETE).
 * @param {object} [body=null] - Request body for POST/PATCH.
 * @returns {Promise<object>} - JSON response from API.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorDetail = await response.json();
    console.error('Error details:', errorDetail);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null;
  }
}

export async function createProject(project) {
  return apiRequest('/project', 'POST', project);
}

export async function getProjects() {
  return apiRequest('/project');
}

export async function getProjectById(id) {
  const data = await apiRequest(`/project?id=eq.${id}`);
  return data[0];
}

export async function updateProject(id, project) {
  return apiRequest(`/project?id=eq.${id}`, 'PATCH', project);
}

export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
}

export async function getLocationsByProjectId(projectId) {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

export async function createLocation(location) {
  return apiRequest('/location', 'POST', location);
}

export async function updateLocation(id, location) {
  return apiRequest(`/location?id=eq.${id}`, 'PATCH', location);
}

export async function deleteLocation(id) {
  return apiRequest(`/location?id=eq.${id}`, 'DELETE');
}

export async function getLocationById(id) {
  const data = await apiRequest(`/location?id=eq.${id}`);
  return data[0];
}

export async function getLocations() {
  return apiRequest('/location');
}

export async function createLocationContent(content) {
  return apiRequest('/location_content', 'POST', content);
}

export async function updateLocationContent(id, content) {
  return apiRequest(`/location_content?id=eq.${id}`, 'PATCH', content);
}

export async function getLocationContentByLocationId(locationId) {
  return apiRequest(`/location_content?location_id=eq.${locationId}`);
}

export async function createTracking(tracking) {
  return apiRequest('/tracking', 'POST', tracking);
}

export async function getTrackings() {
  return apiRequest('/tracking');
}

export async function getTrackingById(id) {
  const data = await apiRequest(`/tracking?id=eq.${id}`);
  return data[0];
}

export async function updateTracking(id, tracking) {
  return apiRequest(`/tracking?id=eq.${id}`, 'PATCH', tracking);
}

export async function deleteTracking(id) {
  return apiRequest(`/tracking?id=eq.${id}`, 'DELETE');
}

export async function getTrackingsByProjectId(projectId) {
  return apiRequest(`/tracking?project_id=eq.${projectId}`);
}

export async function getTrackingsByParticipantUsername(participantUsername) {
  return apiRequest(`/tracking?participant_username=eq.${participantUsername}`);
}

export async function getTrackingsByProjectAndParticipant(projectId, participantUsername) {
  return apiRequest(`/tracking?project_id=eq.${projectId}&participant_username=eq.${participantUsername}`);
}

export async function getLocationScorePoints(locationId) {
  const data = await apiRequest(`/location?id=eq.${locationId}&select=score_points`);
  if (data && data.length > 0) {
    return data[0].score_points ? parseInt(data[0].score_points, 10) : 0;
  } else {
    return 0;
  }
}

export async function deleteAllTrackings() {
  return apiRequest('/tracking', 'DELETE');
}