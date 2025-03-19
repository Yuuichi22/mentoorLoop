import { useState, useEffect } from 'react';
import {  deleteProject, updateProject } from '../services/projectService';
import { Pencil, Trash2, Save, X, Plus, ImagePlus } from 'lucide-react';
import { getAllProjectsOfUser } from '../services/projectService';

export const YourProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [editingprojectId, setEditingprojectId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<{ 
        title: string; 
        content: string; 
        attachments: string[]; 
        tags: string[] 
    }>({ title: "", content: "", attachments: [], tags: [] });

    const [newTag, setNewTag] = useState("");
    const [newAttachment, setNewAttachment] = useState("");

    const token: string | null = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        const fetchProjects = async () => {
            try {
                const data = await getAllProjectsOfUser(token);
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchProjects();
    }, [token]);

    const handleDelete = async (projectId: number) => {
        try {
            await deleteProject(token || " ", projectId);
            setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId)); // Remove deleted project
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleEdit = (project: any) => {
        setEditingprojectId(project.id);
        setEditContent({ 
            title: project.title, 
            content: project.content, 
            attachments: project.attachments || [], 
            tags: project.tags || [] 
        });
    };

    const handleSave = async (projectId: number) => {
        try {
            
            const updatedproject = await updateProject(token || " ", projectId, editContent);
            setProjects((prevprojects : any) =>
                prevprojects.map((project : any) => (project.id === projectId ? updatedproject.data : project))
            );
            setEditingprojectId(null);
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const removeAttachment = (index: number) => {
        setEditContent((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const addAttachment = () => {
        if (newAttachment.trim()) {
            setEditContent((prev) => ({
                ...prev,
                attachments: [...prev.attachments, newAttachment.trim()],
            }));
            setNewAttachment("");
        }
    };

    const removeTag = (index: number) => {
        setEditContent((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !editContent.tags.includes(newTag.trim())) {
            setEditContent((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }));
            setNewTag("");
        }
    };

    return (
        <div className="pt-25 flex flex-col gap-4 items-center">
            {projects.map((project) => (
                <div key={project.id} className="p-10 shadow-md rounded-xl w-[80%]">
                    <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-2 flex-1">
                            {editingprojectId === project.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editContent.title}
                                        onChange={(e) =>
                                            setEditContent({ ...editContent, title: e.target.value })
                                        }
                                        className="border p-2 rounded-md w-full"
                                    />
                                    <textarea
                                        value={editContent.content}
                                        onChange={(e) =>
                                            setEditContent({ ...editContent, content: e.target.value })
                                        }
                                        className="border p-2 rounded-md w-full"
                                    />

                                    {/* Attachments Section */}
                                    <div className="flex flex-wrap gap-2">
                                        {editContent.attachments.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img src={url} alt="" className="h-40 w-40 rounded-md" />
                                                <button 
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <input 
                                            type="text" 
                                            value={newAttachment} 
                                            onChange={(e) => setNewAttachment(e.target.value)}
                                            className="border p-2 rounded-md flex-1"
                                            placeholder="Enter image URL"
                                        />
                                        <button onClick={addAttachment} className="text-green-500">
                                            <ImagePlus />
                                        </button>
                                    </div>

                                    {/* Tags Section */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {editContent.tags.map((tag, index) => (
                                            <div key={index} className="bg-gray-200 px-2 rounded-xl p-1 flex items-center">
                                                {tag}
                                                <button 
                                                    className="ml-2 text-red-500"
                                                    onClick={() => removeTag(index)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <input 
                                            type="text" 
                                            value={newTag} 
                                            onChange={(e) => setNewTag(e.target.value)}
                                            className="border p-2 rounded-md flex-1"
                                            placeholder="Enter tag"
                                        />
                                        <button onClick={addTag} className="text-blue-500">
                                            <Plus />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>{project.title}</div>
                                    <div>{project.content}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.attachments?.map((url: string, index: number) => (
                                            <img key={index} src={url} alt="" className="h-40 w-40 rounded-md" />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        {project.tags?.map((tag: string, index: number) => (
                                            <div key={index} className="bg-gray-200 px-2 rounded-xl p-1">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {editingprojectId === project.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleSave(project.id)} className="text-green-500">
                                    <Save />
                                </button>
                                <button onClick={() => setEditingprojectId(null)} className="text-red-500">
                                    <X />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(project)} className="text-blue-500">
                                    <Pencil />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="text-red-500">
                                    <Trash2 />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
