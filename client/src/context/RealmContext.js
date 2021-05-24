import React, { useState } from 'react';

const RealmContext = React.createContext([{}, () => {}]);

const RealmProvider = (props) => {
  const [state, setState] = useState();

  return (
    <RealmContext.Provider value={[state, setState]}>
      {props.children}
    </RealmContext.Provider>
  );
}

export { RealmContext, RealmProvider };