import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProjectsOfUser } from "../services/projectService";
import { getAllBidsOfUser, removeBidById } from "../services/BidService";

export const YourBids = () => {
    const token : string | null = localStorage.getItem('token')
    if(!token) {window.location.href = "/login";return;}
    const [bids,setBids] = useState([
    
    ])
    const handleDelete = async (token : string,id : number) => {
       const res = await removeBidById(token,id)
       console.log("fromm here",res)
       if(res) {
        const newBids = bids.filter((bid : any) => bid.id!=res.response.id );
        setBids(newBids)
       }
      
    }
    useEffect(() => {
        
        if(!token){
            window.location.href = "/login"
            return ;
        }
        getAllBidsOfUser(token).then(data => setBids(data))
        
    },[])
    console.log("logging",bids[0]);
    return (
        <div className="pt-25">
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Bid ID</th>
                        <th className="border border-gray-400 px-4 py-2">Project ID</th>
                        <th className="border border-gray-400 px-4 py-2">Title</th>
                        <th className="border border-gray-400 px-4 py-2">Tags</th>
                        <th className="border border-gray-400 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid : any) => (
                        <tr key={bid.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{bid.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{bid.project.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{bid.project.title}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex gap-2 justify-center">
                                    {bid.project.tags.map((tag : string, index : number) => (
                                        <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <button className="bg-red-500 p-1 rounded-lg text-white " onClick={() => handleDelete(token,bid.id)}><Trash2></Trash2></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
