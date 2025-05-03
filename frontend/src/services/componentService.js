import axios from '../setup/axios';

const fetchComponents = async (type) => {
  try {
    const response = await axios.get(`/components/${type}`);
    
    // Determine the data source: response itself or response.data
    const data = Array.isArray(response) ? response : response.data;
    
    // Check if data is an array
    if (Array.isArray(data)) {
      console.log('Extracted data:', data);
      return data;
    } else {
      console.error('Expected array but got:', data);
      return { error: 'Invalid data format from server' };
    }
  } catch (error) {
    console.error(`Error fetching components for ${type}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    return { error: error.response?.data?.error || 'Failed to fetch components' };
  }
};

const fetchComponentById = async (componentId) => {
  try {
    const response = await axios.get(`/components/${componentId}`);
    console.log('Response type:', typeof response);
    console.log('Response data:', response);
    
    // Check if we have valid data
    if (response.data && typeof response.data === 'object') {
      console.log('Component data:', response.data);
      return response;
    } else {
      console.error('Invalid component data:', response.data);
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

export { fetchComponents, fetchComponentById };