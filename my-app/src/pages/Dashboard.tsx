import React,{useState,useEffect,useContext} from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { PostCard } from '../components/PostCard';
import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '../app/Store';
import { ProjectCustomCard } from '../components/ProjectCustomCard';
//import { UserContext } from '../context/UserContext';
const FETCH_PROJECT_URL : string = import.meta.env.VITE_FETCH_PROJECT_URL;
const FETCH_POST_URL : string  = import.meta.env.VITE_FETCH_POST_URL;


console.log(FETCH_POST_URL)

interface userInterface {
    firstname : string,
    lastname : string,
    user_type : string,
    email : string,
    password : string
}
export const Dashboard = () => {
    const user = useSelector((state: RootState) => state.user); // Access user state
   console.log("logging user state ",user)
    const [content,setContent] = useState([])

    const fetchPosts = async (token : string ) =>{
        const res = await fetch(FETCH_POST_URL,{
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        const data = await res.json()
        setContent(data.posts)
    }
    const fetchProjects = async (token : string) =>{
        const res = await fetch(FETCH_PROJECT_URL,{
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log(data.projects)
        setContent(data.projects)
    }
  useEffect(()=>{
    const token : string | null = window.localStorage.getItem('token') 
    if(!token) window.location.href = '/login'
    else
   // if(user.user_type == "STUDENT" && token) {
        fetchProjects(token)
    //}
    //else if(token){
      //  fetchPosts(token)
    //}
    },[user])
    return (
        <div className='pt-25 flex flex-col gap-10 items-center'>
            {content.map((item : any)=>{
                return <>
                    {user.user_type == "STUDENT" ? <ProjectCustomCard key={item.id} {...item}/> : <PostCard key ={item.id} {...item}/>}
                </>
            })}
        </div>
    )
}