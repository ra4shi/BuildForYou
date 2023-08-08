import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadSingleImage = async (base64) => {
    try {
      const response = await axios.post(
        '/api/localadmin/uploadImage',
        {
          image: base64,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('localtoken'),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/localadmin/projects', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('localtoken'),
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64Image = await convertBase64(file);

      // Send the image data to the backend
      await uploadSingleImage(base64Image);

      // Refresh the projects after successful upload
      fetchProjects();
    } catch (error) {
      console.error('Error handling file input:', error);
    }
  };

  return (
    <div>
      <h1>Projects List</h1>
      <input type="file" onChange={handleFileInputChange} />
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.name}</h3>
          <p>{project.aboutproject}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectsPage;
