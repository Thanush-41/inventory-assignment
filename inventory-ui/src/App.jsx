import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5054/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', quantity: '' });
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch {
      setError('Failed to connect to API. Make sure the backend is running.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.sku.trim() || form.quantity === '') {
      setError('All fields are required.');
      return;
    }

    const quantity = parseInt(form.quantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      setError('Quantity must be a non-negative number.');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), sku: form.sku.trim(), quantity }),
      });

      if (!res.ok) {
        setError('Failed to add item.');
        return;
      }

      setForm({ name: '', sku: '', quantity: '' });
      fetchItems();
    } catch {
      setError('Failed to connect to API.');
    }
  };

  const getStatusBadge = (status) => {
    const cls = status === 'In Stock' ? 'badge-in' : status === 'Low Stock' ? 'badge-low' : 'badge-out';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div className="container">
      <h1>Inventory Items Manager</h1>

      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Add New Item</h2>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="0"
            value={form.quantity}
            onChange={handleChange}
          />
          <button type="submit">Add Item</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <h2>Inventory List</h2>
      {items.length === 0 ? (
        <p className="empty">No items yet. Add one above!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.quantity}</td>
                <td>{getStatusBadge(item.stockStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
