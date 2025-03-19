import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
export const LandingPage = () => {
  return (
    <>
      <nav className="flex justify-evenly pl-5 pr-5 p-2 items-center text-sm">
        <div className="flex-1">
          <img src={logo} alt="" className="h-10 w-25" />
        </div>
        <div className="flex-1">
          <ul className="flex justify-evenly">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/signup">Register</Link>{" "}
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Hero />
      <Footer />
    </>
  );
};
