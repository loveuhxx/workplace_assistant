import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Generate } from "@/pages/Generate";
import { Detect } from "@/pages/Detect";
import { Practice } from "@/pages/Practice";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </Layout>
    </Router>
  );
}
