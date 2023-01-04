import { describe, expect, it } from 'vitest';
import { render, screen } from "@testing-library/react";
import App from '../src/App.jsx';

describe('Example test', () => {
  it('Fetches content from the mock API', async () => {
    render(<App />)

    await screen.findByText('someuser@adobe.com');
  })
})
