import { useForm } from "react-hook-form";
import { uploadImage, getPublicUrl } from "../services/supabaseService";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createProject } from "../services/projectService";
import { createPost } from "../services/postService";

interface FormValues
 {
  title: string;
  content: string;
  tags: string;
  attachments: FileList;
}

export const Publish = () => {
  const {user} : any = useSelector(state => state) 
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: FileList) => {
    const uploadedUrls: string[] = [];

    // Convert FileList to an Array and upload files
    await Promise.all(
        Array.from(files).map(async (file) => {
            const { data, error } = await uploadImage(file);
            if (error) {
                console.error("Upload error:", error.message);
                return; // Skip failed uploads
            }
            uploadedUrls.push(getPublicUrl(data.path));
        })
    );

    return uploadedUrls;
};
  const onSubmit = async (data: FormValues) => {
    setUploading(true);
    
    let uploadedUrls: string[] = [];
    if (data.attachments.length > 0) {
      uploadedUrls = await uploadFiles(data.attachments);
    }

    const postData = {
      title: data.title,
      content: data.content,
      tags: data.tags.split(","),
      attachments: uploadedUrls,
    };

    console.log("Submitting post:", postData);
    setUploading(false);
    const token : string | null = localStorage.getItem('token');
      if(token && user.user_type == "STUDENT") {
      //post
   createPost(token,postData)
    }
    else if(token){
      //project
      createProject(token,postData)
    }
  };

  return (
    <form className="p-20" onSubmit={handleSubmit(onSubmit)}>
      <label>Title</label>
      <br />
      <input type="text" {...register("title", { required: true })} className="bg-gray-200 rounded-lg" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <br />

      <label>Content</label>
      <br />
      <input type="text" {...register("content", { required: true })} className="bg-gray-200 rounded-lg" />
      {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      <br />

      <label>Tags (comma-separated)</label>
      <br />
      <input type="text" {...register("tags")} />
      <br />

      <label>Attachments</label>
      <br />
      <input type="file" multiple {...register("attachments")} />
      <br />

      <button type="submit" disabled={uploading} className="bg-blue-500 text-white p-2 rounded-lg">
        {uploading ? "Uploading..." : "POST"}
      </button>
    </form>
  );
};
