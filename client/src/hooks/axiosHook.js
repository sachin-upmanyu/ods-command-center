import axios from "axios";

export const api = axios.create({
  baseURL:process.env.REACT_APP_ENV == 'development' ? 
    process.env.REACT_APP_LOCAL_SERVER_URL : process.env.REACT_APP_PROD_SERVER_URL,
  headers: {
    authorization: "demo",
  },
});

export const useAxios = () => {
  console.log(process.env.REACT_APP_ENV);
  const getRequest = (url) => {
    return api
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response) {
          return {
            status: err.response.status,
            message: err.response.message,
            error: true,
          };
        }
        if (err.request) {
          return {
            status: err.request.status,
            message: "Unable to connect to server",
            error: true,
          };
        }
        return { error: true, message: "Please try again!! later" };
      });
  };
  const postRequest = async (url, body) => {
    return api
      .post(url, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response) {
          return {
            status: err.response.status,
            message: err.response.message,
            error: true,
          };
        }
        if (err.request) {
          return {
            status: err.request.status,
            message: "Unable to connect to server",
            error: true,
          };
        }
        return { error: true, message: "Please try again!! later" };
      });
  };

  const patchRequest = async (url, body) => {
    return api
      .patch(url, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response) {
          return {
            status: err.response.status,
            message: err.response.message,
            error: true,
          };
        }
        if (err.request) {
          return {
            status: err.request.status,
            message: "Unable to connect to server",
            error: true,
          };
        }
        return { error: true, message: "Please try again!! later" };
      });
  };

  const deleteRequestMultiple = async (url, body) => {
    return api
      .delete(url, { data: body })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response) {
          return {
            status: err.response.status,
            message: err.response.message,
            error: true,
          };
        }
        if (err.request) {
          return {
            status: err.request.status,
            message: "Unable to connect to server",
            error: true,
          };
        }
        return { error: true, message: "Please try again!! later" };
      });
  };

  const deleteRequestSingle = async (url) => {
    return api
      .delete(url)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err.response) {
          return {
            status: err.response.status,
            message: err.response.message,
            error: true,
          };
        }
        if (err.request) {
          return {
            status: err.request.status,
            message: "Unable to connect to server",
            error: true,
          };
        }
        return { error: true, message: "Please try again!! later" };
      });
  };
  return {
    getRequest,
    postRequest,
    patchRequest,
    deleteRequestMultiple,
    deleteRequestSingle,
  };
};
