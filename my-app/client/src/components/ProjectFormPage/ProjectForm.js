import { useState } from "react";

function ProjectForm() {
  const [formData, setFormData] = useState(
    { projectName: '', projectDescription: '', contacts: [], projectUrl: '', projectTopics: [], licenses: []})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData.projectName);
  }

  return (
    <form>
      <label>
        Project Name:
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
        />
      </label>
      <label>
        Project Description:
        <input
          type="text"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
        />
      </label>
      <label>
        Project URL:
        <input
          type="text"
          name="projectUrl"
          value={formData.projectUrl}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ProjectForm;