import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/Store";
export const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  return (
    <div className="pt-20">
      <div className="pfp rounded-full overflow-hidden bg-gray-200 h-20 w-20">
        <img src={user.profileUrl ? user.profileUrl : ""} alt="" />
      </div>
      <div className="firstname">{user.firstname + " " + user.lastname}</div>
      <div>USER_TYPE :  {user.user_type}</div>

      <div>{user.email}</div>
      <div className="bio">
        {user.bio ? user.bio : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quasi molestiae temporibus aperiam veniam ipsum consequatur porro voluptatibus, unde perferendis quibusdam facere corrupti eligendi explicabo eos provident perspiciatis quia sint id dolorum odio necessitatibus exercitationem. Nesciunt quidem enim adipisci eos autem, optio possimus minima itaque cupiditate distinctio quod, maiores vero pariatur rerum? Doloremque, nostrum sapiente fugiat cum, quidem ex numquam inventore deleniti vitae porro nulla nisi sunt natus quam rem corporis in quis saepe labore blanditiis architecto itaque? Perspiciatis, dolorem?"}
      </div>

      <div className="flex justify-center">
        <Link to ="/edit-profile">
        <span className="btn bg-black text-white pl-5 pr-5 rounded-2xl p-1 ">
         Edit 
        </span></Link>
        
      </div>
    </div>

  );
};
