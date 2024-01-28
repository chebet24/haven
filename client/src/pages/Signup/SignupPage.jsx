import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Signup from "../../components/Signup/signup";

const SignupPage = () => {
  const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.user);

//   useEffect(() => {
//     if(isAuthenticated === true){
//       navigate("/");
//     }
//   }, [])
  return (
    <div>
        <Signup />
    </div>
  )
}

export default SignupPage