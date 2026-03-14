import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Category as CategoryIcon,
  CurrencyRupee as RupeeIcon,
} from '@mui/icons-material';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchStats } from '../store/slices/itemSlice';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card sx={{ height: '100%', minWidth: 0 }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: `${color}.dark`,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: categories } = useSelector((state) => state.categories);
  const { stats } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back, {user?.name}!
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            icon={<InventoryIcon fontSize="large" />}
            color="primary"
            onClick={() => navigate('/inventory')}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="Categories"
            value={categories.length}
            icon={<CategoryIcon fontSize="large" />}
            color="secondary"
            onClick={() => navigate('/categories')}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="Inventory Value"
            value={`₹${stats.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<RupeeIcon fontSize="large" />}
            color="success"
            onClick={() => navigate('/inventory')}
          />
        </Box>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Start
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the sidebar to navigate to <strong>Categories</strong> to manage product categories,
            or go to <strong>Inventory</strong> to add and manage your items. You can search, filter by
            category, and paginate through your inventory items.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
