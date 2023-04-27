import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import ErrorPage from './error';
import { NotebookPage } from './NotebookPage';
import { WidgetsPage } from './WidgetsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: async ({ params }) => {
      if (!params.notebookName) return redirect('/nb/widget-test');
      return null;
    },
    children: [
      {
        path: 'nb/:notebookName',
        element: (
          <NotebookPage name="widgets">
            <WidgetsPage />
          </NotebookPage>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);
