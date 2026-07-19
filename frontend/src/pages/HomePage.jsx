import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="dashboard">
      <article className="hero-card">
        <h1>Panel ComercioTech</h1>
        <p>
          Gestiona clientes, productos y pedidos desde una interfaz clara, moderna y
          optimizada para escritorio y dispositivos moviles.
        </p>
      </article>

      <article className="dashboard-card">
        <h2>Clientes</h2>
        <p>Administra registros y datos de contacto de tus clientes.</p>
        <Link to="/clientes">Ir a clientes</Link>
      </article>

      <article className="dashboard-card">
        <h2>Productos</h2>
        <p>Controla catalogo, precios, stock y estado de productos.</p>
        <Link to="/productos">Ir a productos</Link>
      </article>

      <article className="dashboard-card">
        <h2>Pedidos</h2>
        <p>Revisa pedidos, actualiza su estado y mantiene el flujo operativo.</p>
        <Link to="/pedidos">Ir a pedidos</Link>
      </article>
    </section>
  )
}

export default HomePage
