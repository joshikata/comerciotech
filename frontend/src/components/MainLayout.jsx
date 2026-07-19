import { Link, NavLink, Outlet } from 'react-router-dom'

const navLinkClassName = ({ isActive }) =>
  isActive ? 'main-nav__link is-active' : 'main-nav__link'

function MainLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand">
            ComercioTech
          </Link>

          <nav className="main-nav" aria-label="Navegacion principal">
            <NavLink to="/" end className={navLinkClassName}>
              Inicio
            </NavLink>
            <NavLink to="/clientes" className={navLinkClassName}>
              Clientes
            </NavLink>
            <NavLink to="/productos" className={navLinkClassName}>
              Productos
            </NavLink>
            <NavLink to="/pedidos" className={navLinkClassName}>
              Pedidos
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
