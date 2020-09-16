import React from 'react';
import {Link} from 'react-router-dom'

function Navbar() {
    return (
      <div>
        <Link to="/"> Home </Link>
        <Link to="/gaintracker">Gain Tracker</Link>
        <Link to="/planmaker">Plan Maker</Link>
      </div>
    )
  }

export default Navbar