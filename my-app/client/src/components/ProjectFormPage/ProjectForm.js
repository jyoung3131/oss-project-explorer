import { useState } from "react";
import isUrl from "is-url";
import Select from 'react-select';

function ProjectForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectAbstract: '',
    projectUrl: '',
    contacts: [{ name: '', email: '' }],
    projectAreas: [],
    licenses: [],
    guidelinesUrl: ''
  });
  
  const projectAreaOptions = [
    { value: 'ai', label: 'Artifical Intelligence' },
    { value: 'bioscience', label: 'Bioscience' },
    { value: 'compsci', label: 'Computer Science' },
    { value: 'hpc', label: 'High Performance Computing' },
    { value: 'graphics', label: 'Computer Graphics' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'hci', label: 'Human-Computer Interaction' }
  ];
  const licenseOptions = [
    { value: 'mit', label: 'MIT License' },
    { value: 'apache', label: 'Apache License 2.0' },
    { value: 'isc', label: 'ISC License' },
    { value: 'bsd-3', label: 'BSD 3-Clause "New" or "Revised" License' },
  ];

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const newContacts = [...formData.contacts];
    newContacts[index][name] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    const newContacts = [...formData.contacts, { name: '', email: '' }];
    if (newContacts.length <= 5) {
      setFormData({ ...formData, contacts: newContacts });
    }
  };

  const removeContact = (index) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setFormData({ ...formData, [name]: values });
  };

  const validateAllFields = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newErrors.projectName = formData.projectName ? '' : 'Please enter a project name';
    newErrors.projectAbstract = formData.projectAbstract ? '' : 'Please enter an abstract on the project';
    
    newErrors.projectUrl = formData.projectUrl ? (isUrl(formData.projectUrl) ? '' : 'URL is not in a valid format') : 'Please enter a URL to the project page';
    newErrors.guidelinesUrl = formData.guidelinesUrl ? (isUrl(formData.guidelinesUrl) ? '' : 'URL is not in a valid format') : 'Please enter a URL to the project contribution guidelines';
    
    newErrors.contacts = formData.contacts.map(contact => {
      let contactError = {};
      contactError.name = contact.name ? '' : 'Please enter a name';
      contactError.email = contact.email ? (emailRegex.test(contact.email) ? '' : 'Contact email is not in valid email format') : 'Please enter an email';
      return contactError;
    });

    if (formData.contacts.every(contact => !contact.name && !contact.email)) {
      newErrors.contacts = [{ name: 'Please enter at least one contact' }];
    }

    newErrors.projectAreas = formData.projectAreas.length > 0 ? '' : 'Please choose at least one project area';
    newErrors.licenses = formData.licenses.length > 0 ? '' : 'Please choose at least one license';

    setErrors(newErrors);

    const allFieldsValid = Object.values(newErrors).every(error => {
      if (Array.isArray(error)) {
        return error.every(contactError => 
          Object.values(contactError).every(value => !value)
        );
      }

      return !error;
    })

    return allFieldsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonFormData = JSON.stringify(formData);
    const isFormValid = validateAllFields();
    
    if (isFormValid) {
      const response = await fetch('http://localhost:3001/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonFormData,
      });

      if (response.ok) {
        setSuccessMessage("Project submitted successfully!");
      } else {
        setSuccessMessage("Something went wrong...please try again.");
      }
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold font-roboto tracking-tight text-gtblack sm:text-4xl">Open Source Project Information Form</h2>
        <p className="mt-2 text-lg leading-8 text-gtblack">
          Please enter information about the project below
        </p>
      </div>
      <form className="mx-auto mt-16 max-w-xl sm:mt-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <label htmlFor="projectName" className="block font-semibold leading-6 text-gtblack">
              Project Name
            </label>

            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                autoComplete="organization"
                placeholder="Enter the project's name"
              />
            </div>
            {errors.projectName && <div className="text-sm text-red-500">{errors.projectName}</div>}

          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectAbstract" className="block font-semibold leading-6 text-gtblack">
              Project Abstract
            </label>

            <div className="mt-2.5">
              <textarea
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="projectAbstract"
                value={formData.projectAbstract}
                onChange={handleChange}
                rows={4}
                defaultValue={''}
                placeholder="Enter an abstract on the project"
              />
            </div>
            {errors.projectAbstract && <div className="text-sm text-red-500">{errors.projectAbstract}</div>}
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectAreas" className="block font-semibold leading-6 text-gtblack">
              Project Areas
            </label>

            <Select 
              className="block w-full rounded-md border-0 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              isMulti
              name="projectAreas"
              options={projectAreaOptions}
              classNamePrefix="select"
              onChange={(selectedOptions) => handleSelectChange('projectAreas', selectedOptions)} 
            />
            {errors.projectAreas && <div className="text-sm text-red-500">{errors.projectAreas}</div>}
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectLicenses" className="block font-semibold leading-6 text-gtblack">
              Project Licenses
            </label>

            <Select 
              className="block w-full rounded-md border-0 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              isMulti
              name="projectLicenses"
              options={licenseOptions}
              classNamePrefix="select"
              onChange={(selectedOptions) => handleSelectChange('licenses', selectedOptions)} 
            />
            {errors.licenses && <div className="text-sm text-red-500">{errors.licenses}</div>}
          </div>


          <div className="sm:col-span-2 grid grid-cols-1 gap-y-4">
            <label className="block font-semibold leading-6 text-gtblack">
              Primary Contact(s)
            </label>

            {formData.contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                
                <div className="col-span-2 flex items-center">
                  <div className="block text-sm font-semibold leading-6 text-gtblack">Contact {index + 1}</div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="ml-auto flex items-center justify-center rounded-full p-1 text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                <div>
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    type="text" 
                    name="name" 
                    value={contact.name} 
                    onChange={(e) => handleContactChange(index, e)} 
                    placeholder="Enter the contact's full name"
                  />
                  {errors.contacts && errors.contacts[index] && errors.contacts[index].name && <div className="mt-1 text-sm text-red-500">{errors.contacts[index].name}</div>}
                </div>

                <div>
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    type="text" 
                    name="email" 
                    value={contact.email} 
                    onChange={(e) => handleContactChange(index, e)} 
                    placeholder="Enter the contact's email"
                  />
                  {errors.contacts && errors.contacts[index] && errors.contacts[index].email && <div className="mt-1 text-sm text-red-500">{errors.contacts[index].email}</div>}
                </div>

              </div>
            ))}
          </div>


          {formData.contacts.length < 3 && (
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={addContact}
                className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add new Contact
              </button>
            </div>
          )}


          <div className="sm:col-span-2">
            <label htmlFor="projectUrl" className="block font-semibold leading-6 text-gtblack">
              Project Page URL
            </label>

            <div className="relative mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="tel"
                name="projectUrl"
                autoComplete="tel"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="Enter a valid URL to the project page"
              />
            </div>
            {errors.projectUrl && <div className="text-sm text-red-500">{errors.projectUrl}</div>}
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="guidelinesUrl" className="block font-semibold leading-6 text-gtblack">
              Community Contribution Guidelines URL
            </label>

            <div className="relative mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="tel"
                name="guidelinesUrl"
                autoComplete="tel"
                value={formData.guidelinesUrl}
                onChange={handleChange}
                placeholder="Enter a valid URL to the community contribution guidelines page URL"
              />
            </div>
            {errors.guidelinesUrl && <div className="text-sm text-red-500">{errors.guidelinesUrl}</div>}
          </div>


        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="block w-full rounded-md bg-gtgold px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>

          {successMessage && (
            <label htmlFor="successMessage" className="block font-semibold leading-6 text-gtblack pt-3">
              {successMessage}
            </label>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;