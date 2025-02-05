import { useState } from "react";

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return {
    userDetails,
    handleInputChange,
  };
};

export default useUserDetails;