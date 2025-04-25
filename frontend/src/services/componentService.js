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

export { fetchComponents };