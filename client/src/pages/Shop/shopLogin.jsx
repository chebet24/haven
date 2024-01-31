import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';
import ShopLogin from "../../components/Shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
        <ShopLogin />
    </div>
  )
}

export default ShopLoginPage