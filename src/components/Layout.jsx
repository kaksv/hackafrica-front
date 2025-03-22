import Sidebar from './Sidebar';
import MainView from './MainView';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <MainView>{children}</MainView>
    </div>
  );
};

export default Layout;