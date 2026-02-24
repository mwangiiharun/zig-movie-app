import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.textContent).toContain('Popular Movies');
  ReactDOM.unmountComponentAtNode(div);
});
