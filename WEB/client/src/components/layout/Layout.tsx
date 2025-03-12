import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import styled from "styled-components";

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 120px); // Account for header/footer
`;

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </>
  );
};

export default Layout;
