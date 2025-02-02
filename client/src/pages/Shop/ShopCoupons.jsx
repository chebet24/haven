import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSide'
import AllCoupons from "../../components/Shop/AllCoupons";

const ShopCoupouns = () => {
  return (
    
    <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSideBar active={9} />
            </div>
            <div className="w-full justify-center flex">
                <AllCoupons />
            </div>
          </div>
    </div>
    
  )
}

export default ShopCoupouns