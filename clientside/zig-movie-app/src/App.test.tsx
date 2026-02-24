import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Tell React 18 tests that this environment supports `act`
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

it('renders without crashing', async () => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  const div = document.createElement('div');
  const root = createRoot(div);

  await act(async () => {
    root.render(<App />);
  });

  expect(div.textContent).toContain('Popular Movies');
  await act(async () => {
    root.unmount();
  });
});
