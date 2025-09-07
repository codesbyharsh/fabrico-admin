import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  CheckIcon, XIcon, FilterIcon, SearchIcon,
  ExclamationCircleIcon, PencilIcon, SaveIcon,
  ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/outline';

const STATUS_OPTIONS = [
  'Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
];
const PAYMENT_OPTIONS = ['Pending', 'Paid', 'Failed'];

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({ orderId: null, field: null, value: '' });
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => setOrders(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = async (id, payload) => {
    await axios.put(`/api/orders/${id}`, payload);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, ...payload } : o));
    setEditing({ orderId: null, field: null, value: '' });
  };

  const filtered = orders.filter(o => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o._id.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term) ||
      o.user?.mobile?.includes(term);
    const matchesStatus = (statusFilter === 'All') || (o.orderStatus === statusFilter);
    const matchesPayment = (paymentFilter === 'All') || (o.paymentStatus === paymentFilter);
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search by ID/name/mobile"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-1 flex-grow"
        />
        <div className="flex gap-2">
          <FilterIcon className="w-5 h-5 text-gray-600" />
          <select className="border px-2 py-1 rounded" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="border px-2 py-1 rounded" value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option>All</option>
            {PAYMENT_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Items</th>
              <th className="p-2">Total</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Status</th>
              <th className="p-2">Placed</th>
              <th className="p-2">Address</th>
              <th className="p-2">Cancel Reason</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <React.Fragment key={order._id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-2">
                    {order.user.name}<br />
                    <span className="text-xs text-gray-500">{order.user.mobile}</span>
                  </td>
                  <td className="p-2">
                    {order.items.map(it => (
                      <div key={it._id}>👕 {it.product.name} × {it.quantity}</div>
                    ))}
                  </td>
                  <td className="p-2">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <select
                      value={order.paymentStatus}
                      onChange={e => updateOrder(order._id, { paymentStatus: e.target.value })}
                      className="border text-xs px-1"
                    >
                      {PAYMENT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <div className="text-xs">{order.paymentMethod}</div>
                  </td>
                  <td className="p-2">
                    {editing.orderId === order._id && editing.field === 'orderStatus' ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={editing.value}
                          onChange={e => setEditing({ orderId: order._id, field: 'orderStatus', value: e.target.value })}
                          className="border text-xs px-1"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <button onClick={() => updateOrder(order._id, { orderStatus: editing.value })}><SaveIcon className="w-4 h-4 text-green-600"/></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-1 py-0.5 rounded bg-blue-100">{order.orderStatus}</span>
                        <button onClick={() => setEditing({ orderId: order._id, field: 'orderStatus', value: order.orderStatus })}><PencilIcon className="w-4 h-4 text-gray-600"/></button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-xs">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</td>
                  <td className="p-2">
                    <button onClick={() => setExpandedAddress(expandedAddress === order._id ? null : order._id)} className="text-blue-600 underline text-xs">
                      {order.shippingAddress.city}, {order.shippingAddress.taluka}
                    </button>
                  </td>
                  <td className="p-2 text-xs text-red-600">
                    {order.cancellationRequested ? order.cancellationReason || 'Requested' : '—'}
                  </td>
                </tr>
                {expandedAddress === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="9" className="p-2 text-xs text-gray-700">
                      <strong>Full Address:</strong><br/>
                      {order.shippingAddress.name}, {order.shippingAddress.mobile}<br/>
                      {order.shippingAddress.addressLine1}<br/>
                      {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
                      {order.shippingAddress.landmark && <>Landmark: {order.shippingAddress.landmark}<br/></>}
                      {order.shippingAddress.city}, {order.shippingAddress.taluka}, <br/>
                      {order.shippingAddress.district} – {order.shippingAddress.pincode}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
