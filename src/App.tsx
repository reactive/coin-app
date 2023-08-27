import { Link, MatchedRoute } from '@anansi/router';
import { AsyncBoundary } from '@data-client/react';
import { css } from '@linaria/core';
import { memo } from 'react';
import 'style/main.css';

const margin = '8px';

const home = css`
  min-height: 100vh;
  margin: -${margin};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  text-align: center;

  > nav {
    position: fixed;
    top: 0;
    padding: 18px 0 10px;
    width: 100%;
    background-color: #4516f0;
  }

  > main {
    margin-top: 20px;
  }
`;

// Typically place global navigation and routing layer in here
function App() {
  return (
    <div className={home}>
      <nav>
        <Link name="Home">Coinbase Lite</Link>
      </nav>
      <main>
        <AsyncBoundary>
          <MatchedRoute index={0} />
        </AsyncBoundary>
      </main>
    </div>
  );
}
export default memo(App);
