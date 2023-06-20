import { Link } from 'react-router-dom'
import Alamo from './assets/favicon.ico'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='full-navbar'>
      <nav>
        <ul className='navbar'>
          <li><Link to='/'> <img src={Alamo} alt="Logo"/> </Link></li>
          <li><Link to='/' className="hover-color"> Author Medals </Link></li>
          <li><Link to='/World-Records' className="hover-color"> World Records </Link></li>
          <li><Link to='/Tracks' className="hover-color"> Tracks </Link></li>
          <li><Link to='/Map-Authors' className="hover-color"> Map Authors </Link></li>
          <li><Link to='/About' className="hover-color"> About </Link></li>
          <li>
            <a className="cta" href="https://discord.gg/C6QJXc3g2S" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar