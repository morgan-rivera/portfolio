function getErrorMessage(errorData, res) {
  return errorData.error || errorData.message || `${res.statusText} (${res.status})`;
}

function processJSONResponse(res) {
  if (!res.ok) {
    return res.json()
    .catch(() => ({})) // if body isnt json, use empty obj
    .then(errorData => {
      const error = new Error(getErrorMessage(errorData, res));
      error.status = res.status;
      throw error;
    });
  }
  return res.json();
}

function handleError(err) {
  if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
    console.log('You are offline');
    throw new Error('OFFLINE');
  }
  console.error('Error in fetch', err);
  throw err;
}

export default {
  get: (url) => {
    return fetch(url, {
      credentials: 'include'
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

  post: (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

  put: (url, data) => {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

    putFormData: (url, formData) => {
        return fetch(url, {
            method: 'PUT',
            body: formData, 
            credentials: 'include'
        })
        .then(processJSONResponse)
        .catch(handleError);
  },

  delete: (url) => {
    return fetch(url, {
      method: 'DELETE',
      headers: {},
      credentials: 'include'
    })
      .then(processJSONResponse)
      .catch(handleError);
  },
  postFormData: (url, formData) => {
    return fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
    .then(processJSONResponse)
    .catch(handleError);
  }
};