import React from 'react';

const  Header = props => {
  return (
    <header className={props.activeVideo !== false ? 'videoActive' : ''}>
      <h1>Ostinato</h1>
      {props.renderHeaderBtns()}
    </header>
  );
}

export default Header;