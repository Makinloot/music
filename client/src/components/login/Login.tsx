import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { loginUrl } from "../../config/spotify";
const Login: React.FC = () => {
  const [loginUrl, setLoginurl] = useState("");

  useEffect(() => {
    async function getLoginurl() {
      try {
        const res = await axios.get("http://localhost:3000/login");
        const data = res.data;
        setLoginurl(data);
      } catch (error) {
        console.log(error);
      }
    }

    getLoginurl();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <Link to={loginUrl} className="bg-green-400 px-20 py-10">
        login
      </Link>
    </div>
  );
};

export default Login;
