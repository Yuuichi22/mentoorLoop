import {Link} from 'react-router-dom'
import { useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import defaultProfile from '../assets/defaultProfile.webp'
import logo from '../assets/Logo.svg'
import { resetUser } from '../app/features/Auth/authSlice'
import { logout } from '../services/authService'
export const Nav = () => {
    const dispatch  = useDispatch()
    const [visible,setVisible]  = useState(false);
    const user: any = useSelector(state => state)
    console.log("user from nav",user)
    return (
        <nav className='flex justify-between p-5 items-center fixed  w-full bg-white ' >
            <div className="logo">
             <Link to="/"><img src={logo} alt="" height={120} width={120}/></Link>
            </div>  
            <div className="navlinks w-[300px]">
                <ul className='flex justify-between'>
                    {user.user.user_type == "STUDENT" ? <li>
                        <Link to="/your-bids">Your Bids</Link></li> : <></>}
                    <li >{user.user.user_type == "STUDENT" ? <Link to="/your-posts">Your Posts</Link> : <Link to="/your-projects">Your Projects</Link>}</li>
                </ul>
            </div>
            <div className='rounded-full bg-gray-200 w-[40px] h-[40px] overflow-hidden'>
            <div onClick={() => setVisible(!visible)}>
            <img src={user.user.profileUrl ? user.user.profileUrl : defaultProfile} alt="" />
            </div>
           <div  className={`absolute dialog ${visible ? "block" : "hidden"} right-2 top-15 shadow-lg p-2`}>
                    <ul>
                        <li><Link to="/profile">profile</Link></li>
                        <li onClick={() => {
                            logout(dispatch)
                        }}>Logout</li>
                    </ul>
           </div>
          
            </div>
        </nav>
    )
}

