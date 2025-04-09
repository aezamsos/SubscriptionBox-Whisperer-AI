
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoxConfig, Product, api, CURRENCY_SYMBOL } from "@/services/apiService";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, LogIn, MessageCircle, Plus, Trash2, X, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PreviewRequiresLogin from "@/components/PreviewRequiresLogin";

const CreateBox: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([
    { text: "Hi there! I'm your personal box curator. Tell me about your preferences for Indian jewelry and beauty products, and I'll help you create the perfect subscription box!", sender: "ai" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Box configuration state
  const [boxConfig, setBoxConfig] = useState<BoxConfig>({
    name: "",
    description: "",
    frequency: "monthly",
    preferences: [],
    products: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Extracted preferences state
  const [currentPreference, setCurrentPreference] = useState("");
  
  // Current step
  const [currentStep, setCurrentStep] = useState<"chat" | "customize" | "checkout">("chat");

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
    } else {
      setAuthError(false);
    }
  }, [isAuthenticated]);

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Handle sending a chat message
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Block if not authenticated
    if (!isAuthenticated) {
      setAuthError(true);
      toast.error("Please log in to chat with the AI");
      return;
    }
    
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Update messages with user message
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setIsTyping(true);
    setConnectionError(false);
    
    try {
      // Process the message with AI
      const response = await api.processChat(userMessage);
      
      // Check if the response indicates an error
      if (response.includes("having trouble connecting") || response.includes("trouble processing")) {
        setConnectionError(true);
      }
      
      // Add AI response to chat
      setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
      
      // Extract potential preferences from user message
      extractPreferences(userMessage);
      
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting to the AI service. This could be because the API key is not set or there's a network issue.",
        sender: "ai" 
      }]);
      setConnectionError(true);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Extract potential preferences from user message
  const extractPreferences = (message: string) => {
    // In a real app, this would be done by the AI on the backend
    // Here we'll use a simple approach to simulate the functionality
    const keywords = [
      "skincare", "beauty", "makeup", "organic", "vegan", "natural",
      "food", "snack", "tea", "coffee", "eco-friendly", "sustainable",
      "wellness", "fitness", "books", "pet", "home", "candle", "jewelry",
      "necklace", "earrings", "bangles", "ring", "pendant", "gold", "silver",
      "kundan", "meenakari", "temple", "oxidized", "cosmetics", "ayurvedic",
      "herbal", "traditional", "bridal"
    ];
    
    const lowerMessage = message.toLowerCase();
    const foundKeywords = keywords.filter(keyword => lowerMessage.includes(keyword));
    
    if (foundKeywords.length > 0) {
      // Add new unique preferences
      const newPrefs = foundKeywords.filter(
        keyword => !boxConfig.preferences.includes(keyword)
      );
      
      if (newPrefs.length > 0) {
        setBoxConfig(prev => ({
          ...prev,
          preferences: [...prev.preferences, ...newPrefs]
        }));
        
        // Get recommendations based on updated preferences
        if (isAuthenticated) {
          getRecommendations([...boxConfig.preferences, ...newPrefs]);
        }
      }
    }
  };
  
  // Get product recommendations based on preferences
  const getRecommendations = async (preferences: string[]) => {
    // Block if not authenticated
    if (!isAuthenticated) {
      setAuthError(true);
      toast.error("Please log in to get product recommendations");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const recommendedProducts = await api.getRecommendations(preferences);
      
      if (recommendedProducts.length === 0) {
        toast.warning("No products found matching your preferences");
      }
      
      setBoxConfig(prev => {
        // Calculate total price of products
        const total = recommendedProducts.reduce((sum, product) => sum + product.price, 0);
        
        return {
          ...prev,
          products: recommendedProducts,
          total
        };
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Failed to get product recommendations");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a preference manually
  const addPreference = () => {
    // Block if not authenticated
    if (!isAuthenticated) {
      setAuthError(true);
      toast.error("Please log in to add preferences");
      return;
    }
    
    if (!currentPreference.trim()) return;
    
    const preference = currentPreference.trim();
    if (!boxConfig.preferences.includes(preference)) {
      const updatedPreferences = [...boxConfig.preferences, preference];
      setBoxConfig(prev => ({
        ...prev,
        preferences: updatedPreferences
      }));
      
      getRecommendations(updatedPreferences);
    }
    
    setCurrentPreference("");
  };
  
  // Remove a preference
  const removePreference = (pref: string) => {
    const updatedPreferences = boxConfig.preferences.filter(p => p !== pref);
    setBoxConfig(prev => ({
      ...prev,
      preferences: updatedPreferences
    }));
    
    if (isAuthenticated) {
      getRecommendations(updatedPreferences);
    }
  };
  
  // Proceed to next step
  const proceedToNext = () => {
    // Block if not authenticated
    if (!isAuthenticated) {
      setAuthError(true);
      toast.error("Please log in to continue");
      return;
    }
    
    if (currentStep === "chat") {
      setCurrentStep("customize");
    } else if (currentStep === "customize") {
      setCurrentStep("checkout");
    }
  };
  
  // Go back to previous step
  const goBack = () => {
    if (currentStep === "customize") {
      setCurrentStep("chat");
    } else if (currentStep === "checkout") {
      setCurrentStep("customize");
    }
  };
  
  // Save subscription
  const saveSubscription = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save your subscription");
      navigate("/login");
      return;
    }
    
    if (!boxConfig.name) {
      toast.error("Please give your box a name");
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await api.saveSubscription(user!.id, boxConfig);
      
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error("Failed to save your subscription");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login navigation
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Show preview only content if not authenticated
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Personalized Box</h1>
          <p className="text-muted-foreground mb-8">
            Chat with our AI assistant to create a box tailored to your preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Creating your personalized box is simple with our AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="bg-brand/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-brand">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Tell us your preferences</h4>
                      <p className="text-sm text-muted-foreground">
                        Chat with our AI about what jewelry styles and beauty products you love.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-brand/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-brand">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Curate your box</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will suggest products based on your preferences that you can customize.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-brand/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-brand">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Receive and enjoy</h4>
                      <p className="text-sm text-muted-foreground">
                        Get authentic Indian jewelry and beauty products delivered to your doorstep.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Box Preview</CardTitle>
                <CardDescription>
                  Here's a sample of what your customized box might contain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { name: "Traditional Jhumka", price: 1499, category: "Jewelry" },
                    { name: "Kumkumadi Face Oil", price: 850, category: "Beauty" },
                    { name: "Silver Anklet", price: 1299, category: "Jewelry" },
                    { name: "Rose Water Toner", price: 450, category: "Skincare" }
                  ].map((item, i) => (
                    <div key={i} className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                      <div className="font-medium text-sm mb-2">{item.name}</div>
                      <div className="flex items-center text-brand font-bold">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">Monthly Box</div>
                    <div className="font-bold flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      4,098
                    </div>
                  </div>
                  <Button onClick={handleLoginRedirect}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Log in to create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PreviewRequiresLogin 
            message="Log in to create your personalized box of premium Indian jewelry and beauty products!" 
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Personalized Box</h1>
        <p className="text-muted-foreground mb-8">
          Chat with our AI assistant to create a box tailored to your preferences.
        </p>

        {connectionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Having trouble connecting to the AI service. Please make sure the OPENAI_API_KEY is set in your server/.env file.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat and input area */}
          <div className={cn(
            "lg:col-span-2 transition-all",
            currentStep !== "chat" && "hidden lg:block"
          )}>
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle>Chat with BoxWhisperer AI</CardTitle>
                <CardDescription>
                  Tell me about your preferences for Indian jewelry and beauty products
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-auto p-0">
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto hide-scrollbar">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.sender === "user"
                            ? "bg-brand text-white"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 bg-secondary flex items-center">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4">
                <form onSubmit={sendMessage} className="w-full flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isTyping}
                    className="flex-grow"
                  />
                  <Button 
                    type="submit" 
                    disabled={!chatInput.trim() || isTyping}
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4 mr-2" />
                    )}
                    Send
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
          
          {/* Box configuration area */}
          <div className={cn(
            "transition-all",
            currentStep === "chat" ? "lg:col-span-1" : "col-span-full"
          )}>
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Your Box Configuration</CardTitle>
                <CardDescription>
                  {boxConfig.products.length 
                    ? `${boxConfig.products.length} items selected`
                    : "No items selected yet"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Box name and description */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Box Details</h3>
                    <div className="space-y-2">
                      <Input
                        placeholder="Name your box (e.g. My Traditional Jewelry Box)"
                        value={boxConfig.name}
                        onChange={(e) => 
                          setBoxConfig(prev => ({ ...prev, name: e.target.value }))
                        }
                      />
                      <Textarea
                        placeholder="Add a description (optional)"
                        value={boxConfig.description}
                        onChange={(e) =>
                          setBoxConfig(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  {/* Preferences */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Your Preferences</h3>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {boxConfig.preferences.map(pref => (
                          <Badge key={pref} variant="secondary" className="flex gap-1 items-center">
                            {pref}
                            <button
                              onClick={() => removePreference(pref)}
                              className="ml-1 rounded-full"
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {boxConfig.preferences.length === 0 && (
                          <span className="text-muted-foreground text-sm">
                            No preferences added yet. Chat with the AI or add them manually.
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a preference"
                          value={currentPreference}
                          onChange={(e) => setCurrentPreference(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addPreference();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addPreference}
                          disabled={!currentPreference.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery frequency */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Delivery Frequency</h3>
                    <Select
                      value={boxConfig.frequency}
                      onValueChange={(val: "monthly" | "bi-monthly" | "quarterly") => 
                        setBoxConfig(prev => ({ ...prev, frequency: val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-monthly">Bi-Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t flex justify-between">
                {currentStep !== "chat" && (
                  <Button variant="outline" onClick={goBack}>
                    Back
                  </Button>
                )}
                <Button 
                  className={currentStep === "chat" ? "ml-auto" : ""}
                  onClick={currentStep === "checkout" ? saveSubscription : proceedToNext}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentStep === "chat" && "Continue to Customize"}
                  {currentStep === "customize" && "Continue to Checkout"}
                  {currentStep === "checkout" && "Complete Subscription"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Products area - only show in customize or checkout steps */}
          {currentStep !== "chat" && (
            <div className="col-span-full">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Products</CardTitle>
                  <CardDescription>
                    Based on your preferences, we've selected these products for your box
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-brand" />
                      <span className="ml-2">Loading recommendations...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {boxConfig.products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-square bg-muted">
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                            <p className="text-muted-foreground text-xs truncate mb-2">
                              {product.category}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm flex items-center">
                                <IndianRupee className="h-3 w-3 mr-1" />
                                {product.price.toLocaleString('en-IN')}
                              </span>
                              {currentStep === "customize" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => {
                                    setBoxConfig(prev => ({
                                      ...prev,
                                      products: prev.products.filter(p => p.id !== product.id),
                                      total: prev.total - product.price
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {boxConfig.products.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>
                        No products selected yet. Chat with our AI to get recommendations based on your preferences.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Checkout summary - only show in checkout step */}
          {currentStep === "checkout" && (
            <div className="col-span-full mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Box Details</h3>
                        <p className="font-bold">{boxConfig.name || "Untitled Box"}</p>
                        <p className="text-sm text-muted-foreground mb-1">{boxConfig.description || "No description provided"}</p>
                        <Badge>
                          {boxConfig.frequency === "monthly" && "Monthly Delivery"}
                          {boxConfig.frequency === "bi-monthly" && "Bi-Monthly Delivery"}
                          {boxConfig.frequency === "quarterly" && "Quarterly Delivery"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Preferences</h3>
                        <div className="flex flex-wrap gap-1">
                          {boxConfig.preferences.map(pref => (
                            <Badge key={pref} variant="outline">
                              {pref}
                            </Badge>
                          ))}
                          {boxConfig.preferences.length === 0 && (
                            <span className="text-sm text-muted-foreground">No preferences specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Products</h3>
                        <p className="font-medium">
                          {boxConfig.products.length} items selected
                        </p>
                        <p className="flex items-center text-brand font-bold">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {boxConfig.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center text-sm text-muted-foreground mb-6">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          By completing your subscription, you agree to our 
                          Terms of Service and Privacy Policy. You can cancel anytime.
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={saveSubscription}
                          disabled={isLoading}
                          className="w-full md:w-auto"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Complete Subscription</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateBox;
