import ProjectForm from "../ProjectFormPage/ProjectForm";
import { useState, useEffect } from "react";
import { Octokit } from "octokit";

// TODO:
//  - Input HTML for search bar, category checkboxes on side, and database layout
//  - Add styling
//  - Move Github API method to separate file

function ProjectExplorer() {
    const [formData, setFormData] = useState({
        searchedName: '',
        projectAreas: [],
        licenses: [],
        displayedProjects: [],
        allProjects: []
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

    const [showForm, setShowForm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (name, selectedOptions) => {
        const values = selectedOptions.map(option => option.value);
        setFormData({ ...formData, [name]: values });
    };


    // Fetch JSON project data and set allProjects
    useEffect(() => {
        const octokit = new Octokit({
            auth: "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"
        })

        async function fetchProjects() {
            try {
                const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}?ref={branch}", {
                    owner: "gt-ospo",
                    repo: "open-source-project-explorer",
                    path: "project_list.json",
                    branch: "json-form-test"
                })

                const content = atob(response.data.content)
                const projects = JSON.parse(content)

                setFormData(prevState => ({
                    ...prevState,
                    allProjects: projects
                }));
            } catch (error) {
                console.error("Something went wrong while fetching the projects...", error);
            }
        }

        fetchProjects();
    }, []);

    // Detect changes in search bar or category checkboxes and filter projects
    useEffect(() => {
        const filterProjects = () => {
          return formData.allProjects.filter(project => {
            const matchesName = project.name.toLowerCase().includes(formData.searchedName.toLowerCase());
            const matchesDisciplines = formData.projectAreas.length === 0 || project.disciplines.some(discipline => formData.projectAreas.includes(discipline));
            const matchesLicenses = formData.licenses.length === 0 || project.licenses.some(license => formData.licenses.includes(license));
      
            return matchesName && matchesDisciplines && matchesLicenses;
          });
        };
      
        setFormData(prevState => ({
          ...prevState,
          displayedProjects: filterProjects()
        }));
      }, [formData.searchedName, formData.projectAreas, formData.licenses]);
    

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mt-10">
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm bg-gtgold text-white hover:bg-gtgoldlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                    {showForm ? "Close Form" : "Submit New Project"}
                </button>
            </div>
            
            {showForm && <ProjectForm />}
        </div>
    );
};

export default ProjectExplorer;