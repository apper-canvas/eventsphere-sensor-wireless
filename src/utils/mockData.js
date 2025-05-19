/**
 * Mock data for the Event Planner CRM
 * This file contains sample data for clients, events, vendors, finances, and tasks
 */

// Clients data
export const clients = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acmecorp.com', phone: '(555) 123-4567', events: 3, type: 'Corporate', address: '123 Business Ave, New York, NY', preferences: 'Prefers evening events, modern venues' },
  { id: 2, name: 'John & Sarah Smith', email: 'john.smith@example.com', phone: '(555) 987-6543', events: 1, type: 'Individual', address: '456 Maple St, Chicago, IL', preferences: 'Prefers weekend events, classic themes' },
  { id: 3, name: 'TechStart Inc', email: 'events@techstart.io', phone: '(555) 234-5678', events: 2, type: 'Corporate', address: '789 Innovation Blvd, San Francisco, CA', preferences: 'Requires tech-equipped venues, modern catering' },
  { id: 4, name: 'City Foundation', email: 'foundation@city.org', phone: '(555) 876-5432', events: 1, type: 'Non-profit', address: '101 Community Rd, Boston, MA', preferences: 'Eco-friendly venues, accessibility important' },
  { id: 5, name: 'Global Enterprises', email: 'events@globalent.com', phone: '(555) 345-6789', events: 2, type: 'Corporate', address: '222 International Dr, Miami, FL', preferences: 'International cuisine, high-end venues' },
  { id: 6, name: 'Robert & Emma Johnson', email: 'rjohnson@example.com', phone: '(555) 654-3210', events: 1, type: 'Individual', address: '333 Oak Lane, Seattle, WA', preferences: 'Outdoor venues, family-friendly' },
];

// Events data
export const events = [
  {
    id: 1,
    title: "Annual Tech Conference",
    client: "TechCorp Inc.",
    clientId: 1,
    type: "Conference",
    location: "Convention Center, San Francisco",
    startDate: "2023-11-15T09:00:00",
    endDate: "2023-11-17T18:00:00",
    status: "Planning",
    budget: 48000,
    attendees: 500,
    description: "Annual technology conference featuring keynote speakers, workshops, and networking opportunities."
  },
  {
    id: 2,
    title: "Product Launch Gala",
    client: "Innovate Solutions",
    clientId: 3,
    type: "Launch",
    location: "Grand Hotel, New York",
    startDate: "2023-12-05T19:00:00",
    endDate: "2023-12-05T23:00:00",
    status: "Confirmed",
    budget: 35000,
    attendees: 250,
    description: "Exclusive evening gala to launch the new product line, featuring demonstrations and celebrity guests."
  },
  {
    id: 3,
    title: "Corporate Team Building",
    client: "Global Banking Ltd",
    clientId: 5,
    type: "Workshop",
    location: "Mountain Resort, Denver",
    startDate: "2024-01-20T08:00:00",
    endDate: "2024-01-22T16:00:00",
    status: "Planning",
    budget: 22000,
    attendees: 120,
    description: "Three-day retreat focused on team building activities, strategy sessions, and outdoor adventures."
  },
  {
    id: 4,
    title: "Smith Wedding",
    client: "John & Sarah Smith",
    clientId: 2,
    type: "Wedding",
    location: "Rosewood Gardens, Los Angeles",
    startDate: "2023-10-14T16:00:00",
    endDate: "2023-10-14T23:00:00",
    status: "Completed",
    budget: 35000,
    attendees: 150,
    description: "Elegant garden wedding with dinner reception and live music."
  },
  {
    id: 5,
    title: "Charity Fundraiser",
    client: "City Foundation",
    clientId: 4,
    type: "Gala",
    location: "Art Museum, Boston",
    startDate: "2023-12-10T18:00:00",
    endDate: "2023-12-10T22:00:00",
    status: "Confirmed",
    budget: 40000,
    attendees: 200,
    description: "Annual black-tie fundraiser with silent auction, dinner, and keynote speakers."
  }
];

// Vendors data
export const vendors = [
  { id: 1, name: 'Elegant Catering Co.', email: 'contact@elegantcatering.com', phone: '(555) 123-7890', category: 'Catering', rating: 4.8, address: '456 Culinary Ave, Chicago, IL', services: 'Full-service catering, bar service, staff', website: 'www.elegantcatering.com' },
  { id: 2, name: 'Grand Plaza Venue', email: 'events@grandplaza.com', phone: '(555) 456-7890', category: 'Venue', rating: 4.6, address: '789 Event Blvd, New York, NY', services: 'Indoor/outdoor event spaces, parking, AV equipment', website: 'www.grandplaza.com' },
  { id: 3, name: 'Capture Moments Photography', email: 'info@capturemoments.com', phone: '(555) 789-0123', category: 'Photography', rating: 4.9, address: '101 Camera St, Los Angeles, CA', services: 'Event photography, videography, photo booth', website: 'www.capturemoments.com' },
  { id: 4, name: 'Rhythm Band', email: 'booking@rhythmband.com', phone: '(555) 321-6547', category: 'Entertainment', rating: 4.7, address: '222 Music Lane, Nashville, TN', services: 'Live music, DJ services, MC', website: 'www.rhythmband.com' },
  { id: 5, name: 'Decor Dreams', email: 'hello@decordreams.com', phone: '(555) 987-6543', category: 'Decoration', rating: 4.5, address: '333 Design Ave, Miami, FL', services: 'Event decor, floral arrangements, lighting', website: 'www.decordreams.com' },
  { id: 6, name: 'Delightful Desserts', email: 'orders@delightfuldesserts.com', phone: '(555) 654-9870', category: 'Catering', rating: 4.3, address: '444 Baker St, San Francisco, CA', services: 'Custom cakes, dessert tables, pastries', website: 'www.delightfuldesserts.com' },
];

// Budget and finance data
export const finances = [
  { id: 1, eventId: 1, category: 'Venue', description: 'Convention Center Rental', amount: 15000, type: 'expense', date: '2023-08-15', status: 'paid' },
  { id: 2, eventId: 1, category: 'Catering', description: 'Food and Beverage', amount: 12500, type: 'expense', date: '2023-09-01', status: 'pending' },
  { id: 3, eventId: 1, category: 'AV Equipment', description: 'Sound System and Projectors', amount: 5000, type: 'expense', date: '2023-09-15', status: 'pending' },
  { id: 4, eventId: 1, category: 'Deposit', description: 'Client Initial Payment', amount: 20000, type: 'income', date: '2023-07-01', status: 'received' },
  { id: 5, eventId: 2, category: 'Venue', description: 'Grand Hotel Ballroom', amount: 12000, type: 'expense', date: '2023-10-01', status: 'paid' },
  { id: 6, eventId: 2, category: 'Catering', description: 'Premium Menu and Open Bar', amount: 9500, type: 'expense', date: '2023-10-15', status: 'pending' },
  { id: 7, eventId: 2, category: 'Entertainment', description: 'Live Band', amount: 3500, type: 'expense', date: '2023-10-10', status: 'pending' },
  { id: 8, eventId: 2, category: 'Deposit', description: 'Client Initial Payment', amount: 15000, type: 'income', date: '2023-09-01', status: 'received' },
  { id: 9, eventId: 3, category: 'Venue', description: 'Mountain Resort Booking', amount: 10000, type: 'expense', date: '2023-10-01', status: 'paid' },
  { id: 10, eventId: 3, category: 'Activities', description: 'Team Building Exercises', amount: 4500, type: 'expense', date: '2023-11-01', status: 'pending' },
  { id: 11, eventId: 3, category: 'Transportation', description: 'Charter Bus Service', amount: 2200, type: 'expense', date: '2023-11-15', status: 'pending' },
  { id: 12, eventId: 3, category: 'Deposit', description: 'Client Initial Payment', amount: 12000, type: 'income', date: '2023-09-15', status: 'received' },
];

// Tasks data
export const tasks = [
  { id: 1, eventId: 1, title: 'Finalize venue contract', description: 'Review and sign the venue contract for the Tech Conference', dueDate: '2023-09-01', status: 'completed', assignee: 'John Doe' },
  { id: 2, eventId: 1, title: 'Confirm catering menu', description: 'Select final menu options and confirm with caterer', dueDate: '2023-09-15', status: 'in-progress', assignee: 'Sarah Miller' },
  { id: 3, eventId: 1, title: 'Book AV equipment', description: 'Arrange sound system, projectors, and microphones', dueDate: '2023-09-30', status: 'pending', assignee: 'Mike Johnson' },
  { id: 4, eventId: 2, title: 'Send invitations', description: 'Design, print, and mail invitations to all guests', dueDate: '2023-10-15', status: 'completed', assignee: 'Emily Clark' },
  { id: 5, eventId: 2, title: 'Coordinate with performers', description: 'Finalize performance schedule and requirements', dueDate: '2023-11-01', status: 'in-progress', assignee: 'John Doe' },
  { id: 6, eventId: 2, title: 'Arrange transportation', description: 'Book VIP transportation services', dueDate: '2023-11-15', status: 'pending', assignee: 'Sarah Miller' },
  { id: 7, eventId: 3, title: 'Create activity schedule', description: 'Plan detailed itinerary for each day of the retreat', dueDate: '2023-11-01', status: 'in-progress', assignee: 'Mike Johnson' },
  { id: 8, eventId: 3, title: 'Arrange accommodations', description: 'Confirm room assignments and special requests', dueDate: '2023-11-15', status: 'pending', assignee: 'Emily Clark' },
  { id: 9, eventId: 3, title: 'Order team merchandise', description: 'Design and order branded apparel for participants', dueDate: '2023-12-01', status: 'pending', assignee: 'John Doe' },
];

// Financial metrics data
export const financialMetrics = {
  totalRevenue: 147000,
  totalExpenses: 98700,
  profitMargin: 32.8,
  upcomingRevenue: 75000,
  monthlyBreakdown: [
    { month: 'Jan', revenue: 28000, expenses: 19000 },
    { month: 'Feb', revenue: 22000, expenses: 15000 },
    { month: 'Mar', revenue: 35000, expenses: 23500 },
    { month: 'Apr', revenue: 32000, expenses: 21000 },
    { month: 'May', revenue: 40000, expenses: 28000 },
    { month: 'Jun', revenue: 45000, expenses: 31000 },
    { month: 'Jul', revenue: 38000, expenses: 25500 },
    { month: 'Aug', revenue: 42000, expenses: 29000 },
    { month: 'Sep', revenue: 47000, expenses: 32000 },
    { month: 'Oct', revenue: 53000, expenses: 37000 },
    { month: 'Nov', revenue: 49000, expenses: 33000 },
    { month: 'Dec', revenue: 58000, expenses: 41000 },
  ],
  eventProfitability: [
    { event: 'Tech Conference', revenue: 48000, expenses: 32500, profit: 15500 },
    { event: 'Product Launch', revenue: 35000, expenses: 25000, profit: 10000 },
    { event: 'Team Building', revenue: 22000, expenses: 16700, profit: 5300 },
    { event: 'Smith Wedding', revenue: 35000, expenses: 27000, profit: 8000 },
    { event: 'Charity Fundraiser', revenue: 40000, expenses: 30000, profit: 10000 },
  ],
};

// Categories for filtering
export const eventTypes = ['All', 'Conference', 'Wedding', 'Corporate', 'Launch', 'Workshop', 'Gala', 'Other'];
export const vendorCategories = ['All', 'Catering', 'Venue', 'Photography', 'Entertainment', 'Decoration', 'Transportation', 'Accommodation'];
export const clientTypes = ['All', 'Corporate', 'Individual', 'Non-profit', 'Government'];
export const expenseCategories = ['Venue', 'Catering', 'Entertainment', 'Decoration', 'Transportation', 'Marketing', 'Staff', 'Equipment', 'Miscellaneous'];

export default {
  clients,
  events,
  vendors,
  finances,
  tasks,
  financialMetrics,
  eventTypes,
  vendorCategories,
  clientTypes,
  expenseCategories,
};