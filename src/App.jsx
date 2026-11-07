import { Route, Routes } from "react-router-dom";
import Admin from "./components/core/admin/Admin";
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import ChapterDetail from "./components/core/chapters/ChapterDetail";
import Chapters from "./components/core/chapters/Chapters";
import Classes from "./components/core/classes/Classes";
import Dashboard from "./components/core/dashboard/Dashboard";
import Student from "./components/core/student/Student";
import Subjects from "./components/core/subjects/Subjects";
import Subscriptions from "./components/core/subscriptions/Subscriptions";
import Layout from "./components/layout/Layout";
import { usePermissions } from "./hooks/usePermissions";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  const { isSuperAdmin } = usePermissions();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<Dashboard />} />

        {isSuperAdmin && (
          <>
            <Route path="admins" element={<Admin />} />
            {/* <Route path="courses/manage-course" element={<ManageCourse />} /> */}
          </>
        )}

        <Route path="students" element={<Student />} />

        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="chapters" element={<Chapters />} />
        <Route path="chapters/:chapterSlug" element={<ChapterDetail />} />

        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
