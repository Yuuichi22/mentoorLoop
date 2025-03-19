import { useState } from "react"; // Install lucide-react for icons
import defaultProfile from '../assets/defaultProfile.webp'
interface projectInterface{
    id : number,
    title : string,
    content : string,
    tags : string[],
    attachments : string[],
    user : {
        id : string,
        email : string,
        firstname : string,
        lastname : string,
        profileUrl : string,
        bio : string
    }

}


export const ProjectCustomCard = (project : projectInterface) => {
    // Sample project data
   /* const project = {
        author: {
            name: "John Doe",
            username: "@johndoe",
            profilePic: "https://imgs.search.brave.com/QGWw63Ica9HvN7Suem6PrrDkJSarLUsekG1pE-nfPuI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9oYW5kc29tZS1t/YW4tbGF1Z2hpbmct/cHVycGxlXzEzNjgt/OTUyMjIuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZA",
        },
        title: "Create 2D Animation Using Blender",
        description: "Required in a time span of 2 days",
        attachments: [
            "https://aekqimyqcuyhdjzvoatn.supabase.co/storage/v1/object/public/mentorloop/public/Heleum%20Divyansh%20Certifcate.jpg",
            "https://imgs.search.brave.com/hJFN_vofbCfE5-ikewG5d-SJ6wlSkqofMgeVIn28WRY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by93ZWItcHJvZ3Jh/bW1pbmctY29kZV80/MzMxODItMTAuanBn/P3NlbXQ9YWlzX2h5/YnJpZA",
        ],
        tags: ["Blender", "Animation", "2D", "Graphics"],
        profile: {
            bio: "@Sophomore | Animation & Vfx",
            experience: "3 years of experience in animation",
            skills: ["Blender", "After Effects", "Illustrator"],
        },
        isApplied : false
    };*/
    const [isApplied,setIsApplied] = useState(false)

    return (
        <div className="p-6 flex flex-col gap-4  rounded-lg shadow-sm w-[80%]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <div className="rounded-full overflow-hidden w-10 h-10">
                        <img className="w-full h-full object-cover" src={project.user.profileUrl ? project.user.profileUrl : defaultProfile} alt="Profile" />
                    </div>
                    <div>
                        <div className="font-semibold">{project.user.firstname + " "+ project.user.lastname}</div>
                        <div className="text-gray-500 text-sm">{project.user.bio}</div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="font-semibold text-lg">{project.title}</div>

            {/* Expandable Content */}
        
                <div className="mt-2 space-y-4">
                    {/* Description */}
                    <div className="text-gray-700">{project.content}</div>

                    {/* Attachments */}
                    <div className="flex gap-3 overflow-x-auto">
                        {project.attachments.map((attachment, index) => (
                            <div key={index} className="rounded-md overflow-hidden w-32 h-32 border">
                                <img className="w-full h-full object-cover" src={attachment} alt={`Attachment ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <div key={index} className="bg-gray-100 text-sm text-gray-700 rounded-2xl px-3 py-1">
                                {tag}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center gap-3">
                        {
                        !isApplied ? <button className="bg-black text-white pl-3 pr-3 pt-1 pb-1 rounded-xl" onClick={() =>{
                            //project.isApplied = true
                            setIsApplied(true)}}>
                        Apply
                    </button> : 
             <button className="bg-gray  pl-3 pr-3 pt-1 pb-1 rounded-xl" >
             Applied!
         </button>}
                        
                    </div>
                </div>
    
        </div>
    );
};
