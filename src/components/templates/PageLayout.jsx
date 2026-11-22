import { useEffect, useRef } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'

export default function PageLayout() {
  const { pathname } = useLocation()
  const main = useRef(null)
  useEffect(() => {
    main.current.focus()
    window.scrollTo(0, 0)
    document.title = `${pathname === '/dashboard' ? 'Dashboard' : pathname.startsWith('/products') ? 'Produk' : 'Halaman tidak ditemukan'} | Etalase`
  }, [pathname])

  return (
    <div className="min-h-dvh md:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3"
      >
        Lewati navigasi
      </a>
      <aside className="border-b border-stone-200 bg-white md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-6 text-2xl font-extrabold tracking-tight text-brand-600"
        >
          <ShoppingBag size={28} aria-hidden="true" />
          Etalase.
        </Link>
        <p className="hidden px-6 pb-3 text-xs font-semibold text-stone-500 md:block">
          PUSAT PENJUAL
        </p>
        <nav
          aria-label="Navigasi utama"
          className="flex gap-2 px-3 pb-4 md:flex-col"
        >
          {[
            ['/dashboard', 'Dashboard', LayoutDashboard],
            ['/products', 'Daftar produk', Package],
          ].map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="absolute bottom-6 hidden px-6 text-xs text-stone-500 md:block">
          Pemrograman Web · Tugas 4
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4 md:px-9">
          <span className="text-sm font-semibold">Ruang kelola produk</span>
          <span className="text-xs text-stone-500">
            Etalase / Pusat Penjual
          </span>
        </header>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="mx-auto max-w-7xl px-4 py-7 outline-none md:px-9 md:py-9"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
