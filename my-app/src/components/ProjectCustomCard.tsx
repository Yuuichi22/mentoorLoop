import { useState } from "react"; // Install lucide-react for icons
import defaultProfile from '../assets/defaultProfile.webp'
import { placeBid } from "../services/BidService";
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
    const token : string | null = localStorage.getItem('token')
    if(!token) {window.location.href = "/login";return ;}
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
                            placeBid(token,{project_id : project.id})
                            setIsApplied(true)}}>
                        Apply
                    </button> : 
             <div className="bg-gray  pl-3 pr-3 pt-1 pb-1 rounded-xl" >
             Applied!
         </div>}
                        
                    </div>
                </div>
    
        </div>
    );
};
