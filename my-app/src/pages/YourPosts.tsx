import { useState, useEffect } from 'react';
import { getAllPostsOfUser, deletePost, updatePost } from '../services/postService';
import { Pencil, Trash2, Save, X, Plus, ImagePlus } from 'lucide-react';

export const YourPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
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

        const fetchPosts = async () => {
            try {
                const data = await getAllPostsOfUser(token);
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, [token]);

    const handleDelete = async (postId: number) => {
        try {
            await deletePost(token || " ", postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Remove deleted post
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleEdit = (post: any) => {
        setEditingPostId(post.id);
        setEditContent({ 
            title: post.title, 
            content: post.content, 
            attachments: post.attachments || [], 
            tags: post.tags || [] 
        });
    };

    const handleSave = async (postId: number) => {
        try {
            
            const updatedPost = await updatePost(token || " ", postId, editContent);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? updatedPost.data : post))
            );
            setEditingPostId(null);
        } catch (error) {
            console.error('Failed to update post:', error);
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
            {posts.map((post) => (
                <div key={post.id} className="p-10 shadow-md rounded-xl w-[80%]">
                    <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-2 flex-1">
                            {editingPostId === post.id ? (
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
                                    <div>{post.title}</div>
                                    <div>{post.content}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {post.attachments?.map((url: string, index: number) => (
                                            <img key={index} src={url} alt="" className="h-40 w-40 rounded-md" />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        {post.tags?.map((tag: string, index: number) => (
                                            <div key={index} className="bg-gray-200 px-2 rounded-xl p-1">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {editingPostId === post.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleSave(post.id)} className="text-green-500">
                                    <Save />
                                </button>
                                <button onClick={() => setEditingPostId(null)} className="text-red-500">
                                    <X />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(post)} className="text-blue-500">
                                    <Pencil />
                                </button>
                                <button onClick={() => handleDelete(post.id)} className="text-red-500">
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
