import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store, { persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, RouterProvider, HashRouter} from 'react-router-dom'
// import {Protected} from './components/index.js'

import {Home, Login, Signup, AddProduct, ViewProduct, AllProducts, UserProfile, EditProfile, EditProduct, Contact, Conversation, ChangePassword} from './pages/index.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/contact",
            element: <Contact />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/changePassword",
          element: <ChangePassword />,
        },
        {
          path: "/add-product",
          element: <AddProduct />,
        },
        {
          path: "/products/:productId",
          element: <ViewProduct />
        },
        {
          path: "/products/edit/:productId",
          element: <EditProduct />
        },
        {
          path: "/products/allproducts",
          element: <AllProducts />
        },
        {
          path: "/users/:userId",
          element: <UserProfile />
        },
        {
          path: "/users/edit/:userId",
          element: <EditProfile />
        },
        {
          path: "/users/conversation/:receiverId",
          element: <Conversation />
        }
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        {/* <HashRouter> */}
          <RouterProvider router={router} />
        {/* </HashRouter> */}
      </PersistGate>
    </Provider>
  </StrictMode>,
)

