import { render as _render, screen, waitFor } from 'test/utilities';
import { PackingList } from './index';
import { createStore } from './store';
import { Provider } from 'react-redux';
import React from 'react';

const render = (ui: React.ReactElement) => {
  return _render(<Provider store={createStore()}><PackingList /></Provider>)
}

it('renders the Packing List application', () => {
  render(<Provider store={createStore()}><PackingList /></Provider>);
});

it('has the correct title', async () => {
  render(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  render(<PackingList />)
  screen.getByLabelText('New Item Name')
});

it(
  'has a "Add New Item" button that is disabled when the input is empty',
  () => {
    render(<PackingList />)
    const newItemInput = screen.getByLabelText('New Item Name')
    const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' })

    expect(newItemInput).toHaveValue('')
    expect(addNewItemButton).toBeDisabled()
  },
);

it(
  'enables the "Add New Item" button when there is text in the input field',
  async () => {
    const { user } = render(<PackingList />)
    const newItemInput = screen.getByLabelText('New Item Name')
    const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' })

    await user.type(newItemInput, 'MacBook Pro')
    expect(addNewItemButton).toBeEnabled();
  },
);

it(
  'adds a new item to the unpacked item list when the clicking "Add New Item"',
  async () => {
    const { user } = render(<PackingList />)
    const newItemInput = screen.getByLabelText('New Item Name')
    const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' })

    await user.type(newItemInput, 'iPad Pro')
    await user.click(addNewItemButton)

    expect(screen.getByLabelText('iPad Pro')).not.toBeChecked()
  },
);

it(
  'removes an item',
  async () => {
    const { user } = render(<PackingList />)
    const newItemInput = screen.getByLabelText('New Item Name')
    const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' })

    await user.type(newItemInput, 'MacBook Pro')
    await user.click(addNewItemButton)

    const removeItem = screen.getByLabelText(/remove/i)

    await user.click(removeItem)

    waitFor(() => expect(removeItem).not.toBeInTheDocument())
  },
);
