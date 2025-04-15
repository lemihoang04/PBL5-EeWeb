import axios from '../setup/axios';

// const fetchComponents = async (type) => {
//   try {
//     const response = await axios.get(`/components/${type}`);
//     console.log(`Sending request to /components/${type}`);
//     console.log('Response data:', response.data);
//     return response.data; // Expecting an array of components or an error object
//   } catch (error) {
//     console.error(`Error fetching ${type}s:`, error);
//     return { error: error.response?.data?.error || 'Failed to fetch components' };
//   }
  
// };
const fetchComponents = async (type) => {
  try {
    console.log(`Sending request to /components/${type}`);
    const response = await axios.get(`/components/${type}`);
    console.log('Full response:', response);
    // Check if response is already the data array
    const data = response.data !== undefined ? response.data : Array.isArray(response) ? response : [];
    console.log('Processed data:', data);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    if (data === undefined || data === null) {
      console.warn('Data is undefined or null');
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Error fetching ${type}s:`, error.message);
    console.error('Error response:', error.response);
    console.error('Error config:', error.config);
    return { error: error.response?.data?.error || 'Failed to fetch components' };
  }
};

export { fetchComponents };