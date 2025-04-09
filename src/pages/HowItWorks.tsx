
import React from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, PackagePlus, Truck, Calendar, CheckCircle2, Sparkles } from "lucide-react";

const HowItWorks: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How BoxWhisperer Works</h1>
          <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
            Our AI-powered platform makes creating your personalized subscription box simple, 
            intuitive, and fun. Here's how the magic happens.
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="space-y-24">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                  <MessageSquare className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-3xl font-bold mb-4">1. Chat with our AI</h2>
                <p className="text-muted-foreground mb-4">
                  Start by having a conversation with our BoxWhisperer AI. Share your preferences, 
                  interests, dietary restrictions, skin type, or anything else that might help 
                  personalize your box. The more details you provide, the better we can tailor 
                  your subscription.
                </p>
                <ul className="space-y-2">
                  {[
                    "No questionnaires, just natural conversation",
                    "AI learns your preferences over time",
                    "Ask questions about products or categories",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-card border rounded-lg p-6 shadow-md">
                  <div className="mb-4 border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-brand" />
                      <span className="font-medium">BoxWhisperer AI</span>
                    </div>
                    <p className="text-muted-foreground">
                      Hello! I'm your personal box curator. I'd love to learn about your preferences 
                      to create your perfect subscription box. What types of products are you interested in?
                    </p>
                  </div>
                  <div className="mb-4 border-b pb-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="font-medium">You</span>
                    </div>
                    <p className="text-right text-muted-foreground">
                      I'm interested in skincare products that are good for sensitive skin, and I also love 
                      herbal teas and healthy snacks. I prefer natural, organic ingredients when possible.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-brand" />
                      <span className="font-medium">BoxWhisperer AI</span>
                    </div>
                    <p className="text-muted-foreground">
                      Thanks for sharing! For sensitive skin, I'll recommend gentle, fragrance-free 
                      skincare products with soothing ingredients. I'll include a variety of herbal teas 
                      and organic snacks that meet your preferences. Would you like me to focus more on 
                      any particular category?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="bg-card border rounded-lg p-6 shadow-md">
                  <h3 className="font-medium mb-4">Your Personalized Box Preview</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="border rounded-md p-3 bg-background">
                        <div className="h-24 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-3/4 bg-muted rounded-full mb-1"></div>
                        <div className="h-3 w-1/2 bg-muted rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Preferences matched</span>
                      </div>
                      <div className="text-xl font-bold mt-1">$39.99 / month</div>
                    </div>
                    <Button>Customize Box</Button>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                  <PackagePlus className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-3xl font-bold mb-4">2. Customize your box</h2>
                <p className="text-muted-foreground mb-4">
                  After our AI understands your preferences, you'll receive personalized recommendations. 
                  Preview your box contents and make adjustments until it's exactly what you want. 
                  Add, remove, or swap products to create your perfect subscription box.
                </p>
                <ul className="space-y-2">
                  {[
                    "See all product details before subscribing",
                    "Adjust quantities or remove items you don't want",
                    "Save multiple box configurations for different needs",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                  <Calendar className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-3xl font-bold mb-4">3. Choose your frequency</h2>
                <p className="text-muted-foreground mb-4">
                  Select how often you'd like to receive your box. Choose from monthly, bi-monthly, 
                  or quarterly subscriptions to fit your lifestyle and budget. You can always update 
                  your delivery frequency later.
                </p>
                <ul className="space-y-2">
                  {[
                    "Flexible subscription options",
                    "No long-term commitments",
                    "Easily pause, skip, or cancel deliveries",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-card border rounded-lg p-6 shadow-md">
                  <h3 className="font-medium mb-4">Subscription Options</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Monthly", price: "$39.99", highlight: true },
                      { name: "Bi-Monthly", price: "$44.99" },
                      { name: "Quarterly", price: "$54.99" },
                    ].map((option) => (
                      <div 
                        key={option.name} 
                        className={`border rounded-lg p-4 flex justify-between items-center ${
                          option.highlight ? "border-brand bg-brand/5" : ""
                        }`}
                      >
                        <div>
                          <h4 className="font-medium">{option.name}</h4>
                          <p className="text-sm text-muted-foreground">Delivered every {option.name.toLowerCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{option.price}</p>
                          <p className="text-xs text-muted-foreground">per box</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="relative bg-card border rounded-lg p-6 shadow-md">
                  <Sparkles className="absolute top-4 right-4 h-5 w-5 text-brand" />
                  <div className="mb-5">
                    <div className="h-16 w-16 mx-auto bg-muted rounded-lg mb-3"></div>
                    <div className="h-5 w-1/2 mx-auto bg-muted rounded-full"></div>
                  </div>
                  <div className="h-20 bg-muted rounded-md mb-4"></div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-16 bg-muted rounded-md"></div>
                    <div className="h-16 bg-muted rounded-md"></div>
                    <div className="h-16 bg-muted rounded-md"></div>
                    <div className="h-16 bg-muted rounded-md"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand" />
                      <span className="text-sm text-muted-foreground">Delivered Monthly</span>
                    </div>
                    <div className="h-8 w-24 bg-brand rounded-md"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                  <Truck className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-3xl font-bold mb-4">4. Enjoy your deliveries</h2>
                <p className="text-muted-foreground mb-4">
                  Receive your personalized box at your doorstep according to your chosen schedule. 
                  Unbox and discover products carefully selected just for you. As you provide feedback, 
                  our AI gets even better at recommending products you'll love.
                </p>
                <ul className="space-y-2">
                  {[
                    "Free shipping on all subscription boxes",
                    "Discreet packaging with tracking information",
                    "Rate products to improve future recommendations",
                    "Discover new favorites with each delivery",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change my preferences after subscribing?",
                a: "Absolutely! You can update your preferences anytime from your account dashboard. Changes will be reflected in your next box.",
              },
              {
                q: "How do I pause or cancel my subscription?",
                a: "It's easy to pause or cancel your subscription through your account settings. There are no cancellation fees or long-term commitments.",
              },
              {
                q: "When will I be charged for my subscription?",
                a: "You'll be charged immediately for your first box, and then according to your subscription frequency (monthly, bi-monthly, or quarterly) thereafter.",
              },
              {
                q: "Can I skip a delivery if I'm going on vacation?",
                a: "Yes! You can easily skip any upcoming delivery from your account dashboard up to 5 days before your scheduled processing date.",
              },
              {
                q: "Are there any shipping fees?",
                a: "No, all subscription boxes include free shipping to addresses within the United States.",
              },
              {
                q: "How does the AI learn my preferences?",
                a: "Our AI learns from your conversations, product selections, and feedback on items you've received. The more you interact, the more personalized your boxes become.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-card border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-brand/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
            Create your personalized subscription box in minutes and discover products you'll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg">Create Your Box</Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default HowItWorks;
