import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate } from 'react-router-dom';

// Styles
import './index.css';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Routing
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Auth Context
import { AuthProvider } from './AuthContext';

// Pages
import Nav from './Nav';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Cart from './Cart';
import Orders from './Orders';
import ProductPage from './ProductPage';
import AddProduct from './AddProduct';
import ProductDetail from './ProductDetails';
import Checkout from './Checkout';
import CheckoutSuccess from './CheckoutSuccess';
import AdminDashboard from './AdminDashboard';
import CategoryPage from './CategoryPage';
import EditCategory from './EditCategory';
import EditProduct from './EditProduct';
import AllOrders from './AllOrders';
import ShowProducts from './ShowProduct';
import UserDetails from './UserDetails';
import Search from './Search';
import Issues from './Issues';
import Terms from './Terms'; // Create this component


// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'login', element: <Login /> },
      { path: 'profile/:username', element: <Profile /> },
      { path: 'cart', element: <Cart /> },
      { path: 'product', element: <ProductPage /> },
      { path: 'products', element: <ProductPage /> },
      { path: 'product/:productId', element: <ProductDetail /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'success', element: <CheckoutSuccess /> },
      { path: 'search', element: <Search /> },
      { path: 'orders/:username?', element: <Orders /> },
      { path: 'terms', element: <Terms /> },


      // Dashboards
      { path: 'dash/:username', element: <Dashboard /> },
      { path: 'dash/admin', element: <AdminDashboard /> },
      { path: 'admin/dashboard', element: <AdminDashboard /> },
      { path: 'admin/addproduct', element: <AddProduct /> },
      { path: 'admin/edit_product/:id', element: <EditProduct /> },
      { path: 'admin/categories', element: <CategoryPage /> },
      { path: 'admin/category', element: <Navigate to="/admin/categories" replace /> },
      { path: 'edit-category/:id', element: <EditCategory /> },
      { path: 'admin/allorders', element: <AllOrders /> },
      { path: 'admin/user_details', element: <UserDetails /> },
      { path: 'admin/show_products', element: <ShowProducts /> },
      { path: 'admin/issues', element: <Issues /> },

      // 404 fallback
      { path: '*', element: <div className="p-4 text-center">404 - Page Not Found</div> },
    ],
  },
]);

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
