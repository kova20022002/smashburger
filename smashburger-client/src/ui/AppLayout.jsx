import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="min-h-screen bg-smash-gray flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:px-6">
        <Outlet />
      </main>
      <footer className="bg-smash-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Smashburger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
