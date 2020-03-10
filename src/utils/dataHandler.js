import axios from "axios";

export const DataHandle = (function() {
  const postData = (url, userObject, cb) => {
    axios
      .post(url, userObject)
      .then(res => {
        console.log(res.data);
        cb(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getData = (url, cb) => {
    axios
      .get(url)
      .then(res => {
        console.log(res.data);
        cb(res.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return {
    postData,
    getData
  };
})();
