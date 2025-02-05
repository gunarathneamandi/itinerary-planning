import React from "react";

const UserDetailsForm = ({ userDetails, handleInputChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Details</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={userDetails.name}
        onChange={handleInputChange}
        className="border p-2 rounded-md w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userDetails.email}
        onChange={handleInputChange}
        className="border p-2 rounded-md w-full mt-4"
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Phone Number"
        value={userDetails.contact}
        onChange={handleInputChange}
        className="border p-2 rounded-md w-full mt-4"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={userDetails.address}
        onChange={handleInputChange}
        className="border p-2 rounded-md w-full mt-4"
        required
      />
    </div>
  );
};

export default UserDetailsForm;