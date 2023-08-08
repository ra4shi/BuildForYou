
import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../local_admin/AddProject.css'


const AddProject = () => {
  const [name, setName] = useState('');
  const [companyname , setCompanyname] = useState('');
  const [category, setCategory] = useState('');
  const [aboutProject, setAboutProject] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('CompanyName', companyname);
      formData.append('category', category);
      formData.append('aboutproject', aboutProject);
      for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
      }
      console.log(formData)
      console.log(process.env)
    
      const authToken = process.env.local_Secret;
    

      console.log(authToken+'+tokens')
      await axios.post('/api/localadmin/addproject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Project added successfully!');
      navigate('/projects')
      // Reset form fields and state after successful submission
      setName('');
      setCompanyname('');
      setCategory('');
      setAboutProject('');
      setImages([]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div>
      <h1>Add New Project</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Company Name
          <input type="text" value={companyname} onChange={(e) => setCompanyname(e.target.value)} />
        </label>
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label>
          About Project:
          <textarea value={aboutProject} onChange={(e) => setAboutProject(e.target.value)} />
        </label>
        <label>
          Images (Max 3):
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} />
        </label>
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
