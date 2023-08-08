import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';




const CompanyDetails = ({ localId }) => {
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.post('/api/localadmin/showcompany', { localId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('localtoken')}`
        }
      });
      console.log(response);

      if (!response) {
        navigate('/localadmin/addcompanydetails')
      }

      const { company, redirectTo } = response.data;

      if (redirectTo) {
       
        window.location.href = redirectTo;
      } else {
        setCompanyData(company);
      }

      if (response.data.success) {
        toast.success("Details Added");
        navigate('/localadmin/showcompany')
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  

  return (
    <div>
      { companyData ? (
        <div>
          <h1>Company Details</h1>
          <p>Company Name: {companyData.companyname}</p>
          <p>Company Username: {companyData.companyusername}</p>
          <p>Company Categories: {companyData.companycategories}</p>
          <p>About Company: {companyData.aboutcompany}</p>
          <p>Certifications: {companyData.certifications}</p>
          <p>License: {companyData.license}</p>
        </div>
      ) : (
        <p>Loading company details...</p>
      )}
    </div>
  );
};

export default CompanyDetails;
