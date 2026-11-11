import './styles.css'
import { hydrateRoot } from 'react-dom/client'
import HomePage from './components/HomePage.jsx'
import AstherionPage from './components/AstherionPage.jsx'

const root = document.getElementById('root')
const Page = root.dataset.page === 'astherion' ? AstherionPage : HomePage
hydrateRoot(root, <Page />)

// Motion is loaded after hydration. Content never waits on it.
if (document.documentElement.getAttribute('data-motion') === 'on') {
  import('./motion/climb.js')
    .then((m) => m.start(root.dataset.page))
    .catch((err) => {
      console.warn('motion unavailable', err)
      document.documentElement.setAttribute('data-motion', 'still')
    })
}
