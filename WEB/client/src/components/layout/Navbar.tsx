import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: #f8f9fa;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
`;

const NavItems = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #007bff;
  }

  &.active {
    color: #007bff;
    border-bottom: 2px solid #007bff;
  }
`;

const Navbar: React.FC = () => {
  return (
    <Nav>
      <NavContainer>
        <Logo>Flashcards</Logo>
        <NavItems>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/practice">Practice</StyledNavLink>
          <StyledNavLink to="/decks">Manage Decks</StyledNavLink>
          <StyledNavLink to="/progress">Progress</StyledNavLink>
        </NavItems>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
