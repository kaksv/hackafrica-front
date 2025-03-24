import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainView from './MainView';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <MainView>{children}</MainView>
      </div>
    </div>
  );
};

export default Layout;