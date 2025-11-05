

// Get config for current environment
export const getApiConfig = () => {
  return process.env.REACT_APP_API_URL;
};

// Default export with all configs
export default getApiConfig;