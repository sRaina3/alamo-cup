import { Link } from 'react-router-dom'

import './Navbar.css'

const Navbar = () => {
  return (
    <div className='full-navbar'>
      <nav>
        <ul className='navbar'>
          <li><Link to='/' className="hover-color"> Player Ranking </Link></li>
          <li><Link to='/Map' className="hover-color"> Map Ranking </Link></li>
          <li><Link to='/Mapper' className="hover-color"> Mapper Ranking </Link></li>
          <li><Link to='/About' className="cta"> About </Link></li>
          <li><Link to='/Socials' className="cta"> Socials </Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar