import { Route, Routes } from "react-router-dom";
import Admin from "./components/core/admin/Admin";
import ManageAdmin from "./components/core/admin/ManageAdmin";
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Course from "./components/core/course/Course";
import ManageCourse from "./components/core/course/ManageCourse";
import Quiz from "./components/core/course/quiz/Quiz";
import Dashboard from "./components/core/dashboard/Dashboard";
import ManageMeeting from "./components/core/meeting/ManageMeeting";
import Meeting from "./components/core/meeting/Meeting";
import ManageStudent from "./components/core/student/ManageStudent";
import Student from "./components/core/student/Student";
import Layout from "./components/layout/Layout";
import { usePermissions } from "./hooks/usePermissions";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TestSeries from "./components/core/test-series/TestSeries";
import Questions from "./components/core/test-series/Questions";
import Result from "./components/core/result/Result";
import Program from "./components/core/program/Program";
import ManageProgram from "./components/core/program/ManageProgram";

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
            <Route path="admins/manage-admin" element={<ManageAdmin />} />
            <Route path="courses/manage-course" element={<ManageCourse />} />
            <Route path="programs" element={<Program />} />
            <Route path="programs/manage-program" element={<ManageProgram />} />
          </>
        )}

        <Route path="courses" element={<Course />} />
        <Route path="courses/:courseId" element={<Quiz />} />
        <Route path="test-series" element={<TestSeries />} />
        <Route path="test-series/:testId" element={<Questions />} />
        <Route path="results" element={<Result />} />

        <Route path="students" element={<Student />} />
        <Route path="students/manage-student" element={<ManageStudent />} />

        <Route path="meetings" element={<Meeting />} />
        <Route path="meetings/manage-meeting" element={<ManageMeeting />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
