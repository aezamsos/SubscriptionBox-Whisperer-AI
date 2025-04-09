
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { BoxConfig, api, CURRENCY_SYMBOL } from "@/services/apiService";
import { Badge } from "@/components/ui/badge";
import { Box, Calendar, CreditCard, LogOut, PackageOpen, Settings, ShoppingBag, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [subscription, setSubscription] = useState<BoxConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user's subscription from the backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const subscriptions = await api.getSubscriptions();
        
        if (subscriptions && subscriptions.length > 0) {
          // Transform the subscription data to match our BoxConfig type
          const latestSubscription = subscriptions[0]; // Get the most recent one
          
          // Transform products format to match our frontend model
          const products = latestSubscription.products.map((item: any) => ({
            id: item.product._id,
            name: item.product.name,
            description: item.product.description,
            image: item.product.image,
            price: item.product.price,
            category: item.product.category
          }));
          
          // Calculate total
          const total = products.reduce((sum: number, product: any) => sum + product.price, 0);
          
          setSubscription({
            name: latestSubscription.name,
            description: latestSubscription.description,
            frequency: latestSubscription.frequency,
            preferences: latestSubscription.preferences,
            products: products,
            total: total
          });
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);
  
  // Placeholder order history
  // In a real app, this would come from your API
  const orderHistory = [
    {
      id: "ORD-1234",
      date: "April 1, 2025",
      status: "Delivered",
      total: 2999
    },
    {
      id: "ORD-1122",
      date: "March 1, 2025",
      status: "Delivered",
      total: 2999
    },
    {
      id: "ORD-1001",
      date: "February 1, 2025",
      status: "Delivered",
      total: 2999
    },
  ];
  
  // Next delivery date - calculated from the subscription if available
  const nextDeliveryDate = subscription?.nextDeliveryDate || "Loading...";
  
  // If no user is logged in, redirect to login page
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // User's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">
              Manage your subscription and account settings
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-t-brand border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <p className="text-muted-foreground">Loading your subscription...</p>
              </div>
            ) : subscription ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <CardTitle>{subscription.name}</CardTitle>
                        <CardDescription>{subscription.description}</CardDescription>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <span className="text-muted-foreground text-sm">Next Delivery</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{nextDeliveryDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscription Details</h3>
                        <div className="space-y-1">
                          <p className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium capitalize">{subscription.frequency}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">
                              {CURRENCY_SYMBOL}{subscription.frequency === "monthly" ? "2,999" :
                                subscription.frequency === "bi-monthly" ? "3,499" : "4,499"}
                              <span className="text-muted-foreground text-xs">
                                {" "}/ {subscription.frequency.replace("-", " ")}
                              </span>
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>Status:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              Active
                            </Badge>
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Preferences</h3>
                        <div className="flex flex-wrap gap-1">
                          {subscription.preferences.map(pref => (
                            <Badge key={pref} variant="outline" className="capitalize">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end md:justify-start lg:justify-end">
                        <div className="space-x-2">
                          <Link to="/create">
                            <Button variant="outline">Edit Box</Button>
                          </Link>
                          <Button variant="outline" className="text-destructive hover:text-destructive">
                            Pause Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Current Box Contents</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {subscription.products.map((product) => (
                      <Card key={product.id}>
                        <div className="aspect-square bg-muted">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm truncate">{product.name}</h3>
                          <p className="text-muted-foreground text-xs truncate mb-1">
                            {product.category}
                          </p>
                          <p className="font-bold text-sm">
                            {CURRENCY_SYMBOL}{product.price.toLocaleString('en-IN')}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 bg-muted h-16 w-16 rounded-full flex items-center justify-center">
                  <Box className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Active Subscription</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You don't have any active subscription boxes yet. Create your personalized box to get started.
                </p>
                <Link to="/create">
                  <Button>Create Your Box</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View the status of recent orders and track your deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orderHistory.length > 0 ? (
                  <div className="space-y-6">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <PackageOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <Badge variant={
                            order.status === "Delivered" ? "outline" : 
                            order.status === "Shipped" ? "secondary" : "default"
                          } className={
                            order.status === "Delivered" ? "bg-green-50 text-green-700 hover:bg-green-50" : ""
                          }>
                            {order.status}
                          </Badge>
                          <span className="font-bold">{CURRENCY_SYMBOL}{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Notification Preferences</h3>
                  <div className="space-y-2">
                    {[
                      { id: "order-updates", label: "Order Updates and Shipping Notifications" },
                      { id: "subscription-reminders", label: "Subscription Renewal Reminders" },
                      { id: "product-recs", label: "Product Recommendations" },
                      { id: "promotions", label: "Promotions and Special Offers" },
                    ].map((preference) => (
                      <div key={preference.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={preference.id}
                          defaultChecked={true}
                          className="rounded border-gray-300 text-brand focus:ring-brand"
                        />
                        <label htmlFor={preference.id} className="text-sm">
                          {preference.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-muted rounded-md flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="font-medium mb-3">Billing History</h3>
                  {orderHistory.length > 0 ? (
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{order.date}</p>
                            <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{CURRENCY_SYMBOL}{order.total.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-green-600">Paid</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No billing history available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
