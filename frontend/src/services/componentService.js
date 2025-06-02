import axios from '../setup/axios';

/**
 * Fetches components by type with optional attribute filters
 * @param {string} type - Component type (CPU, GPU, RAM, etc.)
 * @param {Object} filters - Optional filters as key-value pairs
 * @returns {Promise<Array|Object>} - Components array or error object
 */
const fetchComponents = async (type, filters = {}) => {

  // Create URL and query params
  let url = `/components/${type}`;

  // Add filters as query parameters if provided
  const params = new URLSearchParams();
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
  }

  // Append query string to URL if params exist
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }


  console.log(`Fetching components from: ${url}`);
  const response = await axios.get(url);
  // console.log('Response status:', response.status);
  // Process the response

  const data = response;
  console.log('Response data:', data);

  // Ensure data is an array
  if (Array.isArray(data)) {
    console.log(`Received ${data.length} components`);
    return data;
  } else {
    console.error('Expected array but got:', typeof data);
    return { error: 'Invalid data format from server' };
  }


  // Handle 404 specifically


};

const fetchComponentById = async (componentId) => {
  try {
    const response = await axios.get(`/components/${componentId}`);


    // Check if we have valid data
    if (response && typeof response === 'object') {
      console.log('Component data:', response);
      return response;
    } else {
      console.error('Invalid component data:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching component with ID ${componentId}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch component with ID ${componentId}`,
      status: error.response?.status
    };
  }
};
const fetchCompatibleCPUs = async (cpuSocket) => {
  try {
    const response = await axios.get(`/cpu/compatible/${cpuSocket}`);
    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible CPUs`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible CPU data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible CPUs for socket ${cpuSocket}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible CPUs for socket ${cpuSocket}`,
      status: error.response?.status
    };
  }
};

const fetchCompatibleCpuCoolers = async (cpuSocket) => {
  try {
    const response = await axios.get(`/cpu-coolers/compatible/${cpuSocket}`);

    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible CPU coolers`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible CPU coolers data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible CPU coolers for socket ${cpuSocket}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible CPU coolers for socket ${cpuSocket}`,
      status: error.response?.status
    };
  }
};

const fetchCompatibleMainboards = async (cpuSocket) => {
  try {
    const response = await axios.get(`/mainboards/compatible/${cpuSocket}`);

    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible Mainboards`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible Mainboards data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible Mainboards for socket ${cpuSocket}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible Mainboards for socket ${cpuSocket}`,
      status: error.response?.status
    };
  }

};

const fetchCompatibleRam = async (memory_type) => {
  try {
    const response = await axios.get(`/ram/compatible/${memory_type}`);
    console.log('Response:', response);
    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible RAM modules`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible RAM data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible RAM for mainboard ID ${memory_type}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible RAM for mainboard ID ${memory_type}`,
      status: error.response?.status
    };
  }
};

const fetchCompatibleStorage = async () => {
  try {
    const response = await axios.get('/storage/compatible');
    console.log('Response:', response);
    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible storage devices`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible storage data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error('Error fetching compatible storage devices:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || 'Failed to fetch compatible storage devices',
      status: error.response?.status
    };
  }
};

const fetchCompatibleCases = async (formFactor) => {
  try {
    const response = await axios.get(`/cases/compatible/${formFactor}`);

    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible cases`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible cases data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible cases for form factor ${formFactor}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible cases for form factor ${formFactor}`,
      status: error.response?.status
    };
  }
};

const fetchCompatiblePSU = async (totalTDP) => {
  try {
    const response = await axios.get(`/psu/compatible/${totalTDP}`);

    // Check if we have valid data
    if (response && Array.isArray(response)) {
      console.log(`Received ${response.length} compatible PSUs`);
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Compatible PSU data:', response);
      return response;
    } else {
      console.error('Invalid data format:', response);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching compatible PSUs for total TDP ${totalTDP}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: error.response?.data?.error || `Failed to fetch compatible PSUs for total TDP ${totalTDP}`,
      status: error.response?.status
    };
  }
};


export { fetchComponents, fetchComponentById, fetchCompatibleCPUs, fetchCompatibleCpuCoolers, fetchCompatibleMainboards, fetchCompatibleRam, fetchCompatibleStorage, fetchCompatibleCases, fetchCompatiblePSU };