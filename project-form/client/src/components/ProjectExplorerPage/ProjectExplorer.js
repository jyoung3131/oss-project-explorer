import React from "react";
import { useMemo, useState, useEffect } from "react";
import ProjectForm from "../ProjectFormPage/ProjectForm";
import { useReactTable, createColumnHelper, getCoreRowModel, getPaginationRowModel, getExpandedRowModel, flexRender } from '@tanstack/react-table';
import { Octokit } from "octokit";

// TODO:
//  - Input HTML for search bar, category checkboxes on side, and database layout
//  - Add styling
//  - Move Github API method to separate file

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor("projectName", {
        header: "Name",
        cell: info => (
            <>
                <button onClick={() => info.row.toggleExpanded()}>
                    {info.row.getIsExpanded() ? '👇' : '👉'}
                </button>
                {info.getValue()}
            </>
        ),
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
    const [projects, setProjects] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

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
        state: {
            expanded,
            pagination,
        },
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    

    return (
        <div className="isolate bg-white">
            <div className="flex justify-between items-center p-3 lg:px-8 bg-gtgold w-full">
                <h1 className="text-3xl font-semibold text-white">Open Source Projects</h1>
            </div>

            <div className="table-container max-h-[500px] px-6 lg:px-8 overflow-y-auto">
                <table className="w-full">
                    {/* Table headers */}
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="text-left">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Table rows */}
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <React.Fragment key={row.id}>
                                <tr className={`px-4 py-2 text-left ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr className={`px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
                                        <td colSpan={columns.length}>
                                            {/* Render your expanded row content here */}
                                            <div>Abstract: {row.original.projectAbstract}</div>
                                            <div>Contacts: {row.original.contacts.map(contact => contact.name).join(", ")}</div>
                                            <div>Project URL: <a href={row.original.projectUrl}>{row.original.projectUrl}</a></div>
                                            <div>Guidelines URL: <a href={row.original.guidelinesUrl}>{row.original.guidelinesUrl}</a></div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Empty rows if needed */}
                        {Array.from({ length: 10 - table.getRowModel().rows.length }, (_, index) => (
                            <tr key={`padding-${index}`} className={`px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                <td colSpan={columns.length} className="px-4 py-2">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{"<<"}</button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{"<"}</button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{">"}</button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>{">>"}</button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '100px' }}
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

            {/* Button to add new project */}
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