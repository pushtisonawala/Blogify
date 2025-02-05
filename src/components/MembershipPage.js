import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const membershipPlans = [
  {
    title: 'Free',
    price: '₹0/month',
    icon: CheckCircleIcon,
    color: 'default',
    features: [
      'Access to public blog posts',
      'Basic profile features',
      'Comment on blogs',
      'Share posts on social media',
      'Email notifications'
    ],
    limitations: [
      'Contains advertisements',
      'Limited access to premium content',
      'Basic support only'
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outlined'
  },
  {
    title: 'Pro',
    price: '₹99/month',
    icon: WorkspacePremiumIcon,
    color: 'primary',
    features: [
      'Everything in Free, plus:',
      'Ad-free experience',
      'Exclusive content access',
      'Save posts for offline reading',
      'Priority email support',
      'Early access to new features',
      'Custom profile themes'
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'contained',
    featured: true,
    popular: true
  },
  {
    title: 'Premium',
    price: '₹199/month',
    icon: DiamondIcon,
    color: 'secondary',
    features: [
      'Everything in Pro, plus:',
      'Personal blog subdomain',
      'Advanced analytics dashboard',
      'API access',
      'Collaboration tools',
      'Direct support line',
      'Exclusive webinars',
      'Custom blog themes'
    ],
    buttonText: 'Get Premium',
    buttonVariant: 'contained'
  }
];

const MembershipPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const handleSubscriptionConfirm = async () => {
    setSubscribing(true);
    try {
        // Simulate a delay for development message
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSnackbar({
            open: true,
            message: 'Subscription feature is still under development.',
            severity: 'info'
        });
        setOpenDialog(false);
    } catch (error) {
        console.error('Subscription error:', error);
        setSnackbar({
            open: true,
            message: 'Error processing subscription',
            severity: 'error'
        });
    } finally {
        setSubscribing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blogify
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom>
            Choose Your Plan
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Unlock the full potential of your blogging journey
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {membershipPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Grid item key={plan.title} xs={12} md={4}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transform: plan.featured ? 'scale(1.05)' : 'none',
                    boxShadow: plan.featured ? '0 8px 24px rgba(0,0,0,0.15)' : undefined,
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="MOST POPULAR"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Icon color={plan.color} sx={{ fontSize: 40, mr: 1 }} />
                      <Typography variant="h4" component="h2">
                        {plan.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h3" color="primary.main" gutterBottom>
                      {plan.price}
                    </Typography>

                    <List dense>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                      {plan.limitations?.map((limitation) => (
                        <ListItem key={limitation} disableGutters sx={{ color: 'text.secondary' }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="disabled" />
                          </ListItemIcon>
                          <ListItemText primary={limitation} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.buttonVariant}
                      color={plan.color}
                      size="large"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            Subscribe to {selectedPlan?.title}
          </DialogTitle>
          <DialogContent>
            <Typography>
              You've selected the {selectedPlan?.title} plan at {selectedPlan?.price}.
              This will give you access to:
            </Typography>
            {selectedPlan?.features && (
              <List dense>
                {selectedPlan.features.map((feature) => (
                  <ListItem key={feature}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubscriptionConfirm}
              disabled={subscribing}
            >
              {subscribing ? 'Processing...' : 'Confirm Subscription'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default MembershipPage;
