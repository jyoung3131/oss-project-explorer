import ProjectForm from "../ProjectFormPage/ProjectForm";
import { useMemo, useState, useEffect } from "react";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Octokit } from "octokit";

// TODO:
//  - Input HTML for search bar, category checkboxes on side, and database layout
//  - Add styling
//  - Move Github API method to separate file

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor("projectName", {
        header: "Name",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.projectAreas.join(", "), {
        id: "projectAreas",
        header: () => "Project Areas",
    }),
    columnHelper.accessor(row => row.licenses.join(", "), {
        id: "licenses",
        header: () => "Licenses",
    }),
];

function ProjectExplorer() {
    const [projects, setProjects] = useState([]);

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

                setProjects(projects);

            } catch (error) {
                console.error("Something went wrong while fetching the projects...", error);
            }
        }

        fetchProjects();
    }, []);

    const data = useMemo(() => projects, [projects]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
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