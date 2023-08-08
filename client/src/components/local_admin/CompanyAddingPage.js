import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {localRequest} from '../../axios'


const AddCompanyPage = () => {
  const [formData, setFormData] = useState({
    companyname: '',
    companyusername: '',
    companycategories: '',
    aboutcompany: '',
    certifications: '',
    license: '',
  });

  const history = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await localRequest({
        url: '/api/localadmin/addcompanydetails',
        method: 'POST',
        data: formData,
      });

      if (response && response.data) {
        const { redirectTo, company } = response.data;
        if (redirectTo) {
          history(redirectTo);
        } else {
          console.log('Company details added:', company);
          // You can set some state or show a success message here
        } 
      } else {
        console.error('Invalid response:', response );
      }
    } catch (error) {
      console.error('Error adding company details:', error);
    }
  };
  return (
    <div className="mx-auto w-[1402px] h-[2009px]">
      <h1 className="text-2xl font-bold text-center">Add Company Details</h1>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black text-xl font-semibold mb-2">Company Name:</label>
          <input
            type="text"
            name="companyname"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            value={formData.companyname}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-black text-xl font-semibold mb-2">Company Username:</label>
          <input
            type="text"
            name="companyusername"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            value={formData.companyusername}
            onChange={handleChange}
          />
        </div>

        {/* Add more form fields as needed */}

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>

  );
};

export default AddCompanyPage;
