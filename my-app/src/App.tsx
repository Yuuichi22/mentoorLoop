
import {Nav} from './components/Nav'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import {ProjectCustomCard} from './components/ProjectCustomCard'
import './App.css' 
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import { Profile } from './pages/Profile'
import { Publish } from './pages/Publish'
import { FloatingActionBtn } from './components/FloatingActionBtn'
import { YourBids } from './pages/YourBids'
import { YourPosts } from './pages/YourPosts'
import { EditProfile } from './pages/EditProfile'
import { LandingPage } from './pages/LandingPage'
function App() {
 const user = {
    firstname : "john",
    lastname : "doe",
    user_type : "STUDENT",
    email : "johndoe@gmail.com",
    password : "johndoe28"
  }

  return (
    <>
        {/*<Nav/>
        <div className='pt-25'>
        <YourBids/>
        {/*<ProjectCustomCard/>
        <ProjectCustomCard/>
        <ProjectCustomCard/>
        <ProjectCustomCard/>

        </div>
        <FloatingActionBtn/>*/}
     
  
    <BrowserRouter>

          {/*<Nav></Nav>*/}
    <Routes>
      <Route path="" element = {<LandingPage/>} />
      <Route path="login" element = {<Login/>} />
      <Route path="signup" element = {<SignUp/>} />
      <Route path="publish" element = {<Publish/>} />
      <Route path="profile" element = {<Profile/>} />
      <Route path="/your-bids" element = {<YourBids/>} />
      <Route path="/your-posts" element = {<YourPosts/>} />
      <Route path="/edit-profile" element = {<EditProfile/>} />
    </Routes>
    <FloatingActionBtn/>
    </BrowserRouter>
    
    </>
  )
}

export default App
