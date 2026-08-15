import { useEffect } from 'react';
import homeMarkup from './content/home.html?raw';
import { initializeSite } from './lib/siteController';
import './styles/site.css';

export default function App() {
  useEffect(() => initializeSite(), []);

  return <div dangerouslySetInnerHTML={{ __html: homeMarkup }} />;
}
