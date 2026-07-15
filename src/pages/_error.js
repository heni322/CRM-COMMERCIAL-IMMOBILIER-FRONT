/**
 * pages/_error.js
 *
 * Required by Next.js for the HMR error overlay and runtime error boundaries.
 * Without this file, any compile/runtime error shows:
 *   "missing required error components, refreshing..."
 * instead of the actual error message.
 */

import Link from 'next/link'

function Error({ statusCode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0 }}>
        {statusCode || 'Erreur'}
      </h1>
      <p style={{ fontSize: 18, marginTop: 16 }}>
        {statusCode === 404
          ? 'Page introuvable.'
          : statusCode === 500
          ? 'Erreur interne du serveur.'
          : "Une erreur inattendue s'est produite."}
      </p>
      <Link
        href='/'
        style={{
          marginTop: 24,
          padding: '10px 24px',
          background: '#1976d2',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
          fontSize: 15
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return { statusCode }
}

export default Error
