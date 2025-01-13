import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ScenePC } from "./paceComponents/Scene.pc";
import { AlignPC } from "./paceComponents/Align.pc";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ScenePC />
        ),
    },
    {
        path: "align",
        element: (<AlignPC />)
    },
]);



export const AppRouter = () => <RouterProvider router={router} />