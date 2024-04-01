import React from "react";
import { useState, useEffect } from "react";

import ProjectForm from "../ProjectFormPage/ProjectForm";
import TitleBar from "../TitleBar/TitleBar";
import ProjectAreaFilter from "../ProjectAreaFilter/ProjectAreaFilter";
import LicenseFilter from "../LicenseFilter/LicenseFilter";
import ProjectTable from "../ProjectTable/ProjectTable";

function ProjectExplorer() {
    const [showForm, setShowForm] = useState(false);
    const [selectedProjectAreas, setSelectedProjectAreas] = useState([]);
    const [selectedLicenses, setSelectedLicenses] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

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

    return (
        <div className="isolate bg-white">
            <TitleBar onSearchChange={handleSearchBarChange}/>

            <div className="flex">
                {/* Filter and Button Column */}
                <div className="flex-col p-4 bg-whites">
                    <ProjectAreaFilter onProjectAreaFilterChange={handleProjectAreaChange}/>
                    <LicenseFilter onLicenseFilterChange={handleLicenseChange}/>

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
                    <ProjectTable columnFilters={columnFilters}/>
                </div>
            </div>
            
            {/* Section where Project Submission form is rendered */}
            {showForm && <ProjectForm />}
        </div>
    );
};

export default ProjectExplorer;