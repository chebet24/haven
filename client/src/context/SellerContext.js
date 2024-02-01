// SellerContext.js
import { createContext, useState, useContext } from 'react';
// Sellercontext.js
const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState({});
  const [shop, setShop] = useState(null);
  const [email, setEmail] = useState(null);
  const [isSeller, setIsSeller] = useState(false); 

  const setSellerData = (type, shop,email) => {
    setSeller(type);
    setShop(shop);
    setEmail(email);
    setIsSeller(type); 

    console.log('Seller Data Set:');
    console.log('Type:', type);
    console.log('Shop:', shop);
    console.log('Email:', email);
    
  };

  return (
    <SellerContext.Provider value={{ seller,email, shop,isSeller, setSellerData }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be within a SellerProvider');
  }
  return context;
};

