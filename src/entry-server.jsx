import { renderToString } from 'react-dom/server'
import HomePage from './components/HomePage.jsx'
import AstherionPage from './components/AstherionPage.jsx'

export const pages = { home: HomePage, astherion: AstherionPage }

export function render(page) {
  const Page = pages[page]
  return renderToString(<Page />)
}
