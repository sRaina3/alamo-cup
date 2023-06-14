import { Link } from 'react-router-dom'

import './Navbar.css'

const Navbar = () => {
  return (
    <div className='full-navbar'>
      <nav>
        <ul className='navbar'>
          <li><Link to='/' className="hover-color"> Author Medals </Link></li>
          <li><Link to='/World-Records' className="hover-color"> World Records </Link></li>
          <li><Link to='/Tracks' className="hover-color"> Tracks </Link></li>
          <li><Link to='/Map-Authors' className="hover-color"> Map Authors </Link></li>
          <li><Link to='/About' className="cta"> About </Link></li>
          <li><Link to='/Socials' className="cta"> Socials </Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar