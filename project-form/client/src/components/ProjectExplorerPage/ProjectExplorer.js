import React from "react";
import { useMemo, useState, useEffect } from "react";
import ProjectForm from "../ProjectFormPage/ProjectForm";
import { 
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    flexRender 
} from '@tanstack/react-table';
import { Octokit } from "octokit";
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// TODO:
//  - Move Github API method to separate file

// Filter method used in Project Area and License columns
const checkboxFilter = (row, id, filterValue) => {
    if (filterValue.length === 0) {
        return true
    }
    
    const rowFilterValues = row.getValue(id).split(", ")
    return filterValue.some(filterVal => rowFilterValues.includes(filterVal))
}

// Columns for React Table
const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor("projectName", {
        header: () => (
            <div className="flex justify-start items-center">
                <div className="opacity-0 h-4 w-7">
                    <ChevronRightIcon />
                </div>
                <span>Name</span>
            </div>
        ),
        cell: info => (
            <div className="flex items-center">
                <button onClick={() => info.row.toggleExpanded()} className="flex items-center justify-center h-5 w-5">
                    {info.row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                </button>
                <span className="ml-2">{info.getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor(row => row.projectAreas.join(", "), {
        id: "projectAreas",
        header: () => "Project Areas",
        filterFn: checkboxFilter
    }),
    columnHelper.accessor(row => row.licenses.join(", "), {
        id: "licenses",
        header: () => "Licenses",
        filterFn: checkboxFilter
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
    const [selectedProjectAreas, setSelectedProjectAreas] = useState([]);
    const [selectedLicenses, setSelectedLicenses] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

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

    // Handles input text to search bar
    const handleSearchBarChange = (e) => {
        const value = e.target.value
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "projectName"),
            { id: "projectName", value: value},
        ]);
    };
    
    // Handles project area filter boxes interactions
    const handleProjectAreaChange = (e) => {
        const value = e.target.value;
        setSelectedProjectAreas(prev => 
            e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
        );
    };
    useEffect(() => {
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "projectAreas"),
            { id: "projectAreas", value: selectedProjectAreas }
        ])
    }, [selectedProjectAreas]);
    
    // Handles project license filter boxes interactions
    const handleLicenseChange = (e) => {
        const value = e.target.value;
        setSelectedLicenses(prev => 
            e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
        );
    };
    useEffect(() => {
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "licenses"),
            { id: "licenses", value: selectedLicenses }
        ])
    }, [selectedLicenses]);

    const data = useMemo(() => projects, [projects]);
    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
            pagination,
            columnFilters,
        },
        onExpandedChange: setExpanded,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    // Pagination calculator
    const getPaginationValues = (page, total) => {
        if (total <= 7) {
            if (total === 0) {
                return [1]
            }

            return Array.from({length: total}, (_, i) => i+1)
        }
        // 1 2 3 4 5 ... 9
        if (page <= 4) {
            return [1, 2, 3, 4, 5, 0, total]
        }
        // 1 ... 4 5 6 ... 9
        if (page >= 5 && page < total-3) {
            return [1, 0, page-1, page, page+1, 0, total]
        }
        // 1 ... 5 6 7 8 9
        if (page >= total-3) {
            return [1, 0, total-4, total-3, total-2, total-1, total]
        }
        
        return null
    }

    return (
        <div className="isolate bg-white">
            {/* Title Bar */}
            <div className="flex justify-between items-center p-3 lg:px-8 bg-gtgold w-full">
                <h1 className="text-4xl font-semibold text-white">Open Source Projects</h1>

                {/* Search Bar */}
                <div className="flex w-1/3">
                    <input
                        type="text"
                        placeholder="Search project by name..."
                        className="w-full rounded-l-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        onChange={handleSearchBarChange}
                    />
                    <div className="bg-gtgolddark rounded-r-md px-3 py-2 flex items-center">
                        <svg
                            className="w-7 h-7 text-white"
                            xlmns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Filter and Button Column */}
                <div className="flex-col p-4 bg-whites">
                    {/* Project Area Filter */}
                    <div>
                        <h2 className="flex text-xl font-semibold pb-3">Project Area</h2>
                        {projectAreaOptions.map(option => (
                            <div key={option.value} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={option.value}
                                    name={option.value}
                                    value={option.value}
                                    onChange={handleProjectAreaChange}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor={option.value} className="ml-2">{option.label}</label>
                            </div>
                        ))}
                    </div>
                    
                    {/* License Filter */}
                    <div>
                        <h2 className="flex text-xl font-semibold pb-3 pt-5">License</h2>
                        {licenseOptions.map(option => (
                            <div key={option.value} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={option.value}
                                    name={option.value}
                                    value={option.value}
                                    onChange={handleLicenseChange}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor={option.value} className="ml-2">{option.label}</label>
                            </div>
                        ))}
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
                </div>

                {/* Table and Nav Bar */}
                <div className="flex-grow">
                    {/* Project Table*/}
                    <div className="table-container px-6 lg:px-8 overflow-y-auto">
                        <table className="w-full">
                            {/* Table headers */}
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="text-left text-lg font-semibold">
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-4 py-2 w-52">
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
                                        {/* Expanded row content */}
                                        {row.getIsExpanded() && (
                                            <tr className={`px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                                <td colSpan={columns.length}>
                                                    <div className="flex w-full">
                                                        <div className="w-5/12 border-r border-gray-400 overflow-auto max-h-64">
                                                            <h3 className="text-center mb-2 font-semibold">Abstract</h3>
                                                            <p>{row.original.projectAbstract}</p>
                                                        </div>
                                                        <div className="w-1/4 border-r border-gray-400">
                                                            <h3 className="text-center mb-2 font-semibold">Primary Contact(s)</h3>
                                                            <ul>
                                                                {row.original.contacts.map((contact, index) => {
                                                                    return (
                                                                        <li className="mb-2 break-all">
                                                                            {index + 1}. {contact.name} ({contact.email})
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </div>

                                                        <div className="w-1/3">
                                                            <h3 className="text-center mb-2 font-semibold">URLs</h3>
                                                            <p className="font-medium">Project URL: <a href={row.original.projectUrl} className="font-normal break-all">{row.original.projectUrl}</a></p>
                                                            <p className="font-medium">Guidelines URL: <a href={row.original.guidelinesUrl} className="font-normal break-all">{row.original.guidelinesUrl}</a></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}

                                {/* Empty rows if needed */}
                                {Array.from({ length: pagination.pageSize - table.getRowModel().rows.length }, (_, index) => (
                                    <tr key={`padding-${index}`} className={`px-4 py-2 ${((table.getRowModel().rows.length + index) % 2) === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                        <td colSpan={columns.length} className="px-4 py-2">&nbsp;</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Page Navigation Bar */}
                    <div className="flex items-center justify-center mt-4 mb-4 space-x-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-2 rounded-l-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                &laquo;
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                &lsaquo;
                            </button>

                            <div className="flex items-center">
                                {/* Render page numbers */}
                                {getPaginationValues(table.getState().pagination.pageIndex+1, table.getPageCount()).map((value, index) => {
                                    if (value === 0) {
                                        return (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 bg-gray-200">
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => table.setPageIndex(value - 1)}
                                            className={`px-3 py-2 ${
                                                table.getState().pagination.pageIndex === value - 1
                                                    ? 'bg-gtgold text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                &rsaquo;
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-2 rounded-r-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                &raquo;
                            </button>
                        </div>

                        <span className="flex items-center gap-1">
                            Go to page:
                            <input
                                type="number"
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                min={1}
                                max={table.getPageCount()}
                                onChange={e => {
                                    let page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    page = Math.max(0, Math.min(page, table.getPageCount() - 1));
                                    table.setPageIndex(page);
                                }}
                                className="border p-1 rounded w-16"
                            />
                        </span>

                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="bg-gray-200 rounded-md"
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Section where Project Submission form is rendered */}
            {showForm && <ProjectForm />}
        </div>
    );
};

export default ProjectExplorer;