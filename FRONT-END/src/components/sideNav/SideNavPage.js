import React from 'react';
import './SideNavPage.css'

const SideNavPage = () => {
  return (
    <div className="sidenav">
      <h1>Side Navigation</h1>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        {/* Add more list items as needed */}
      </ul>
    </div>
  );
};

export default SideNavPage;
